const {io} = require('socket.io-client');
const loginUser = require("../helpers/loginUser");
const createUser = require("../helpers/createUser");
const request = require('supertest');
const app = require('../../app')
const { server } = require("../../server");

let httpServer;
let socket1;

beforeAll((done) => {
    httpServer = server.listen(4000, ()=>{done()});
});

afterEach(() => {
    if(socket1?.connected) socket1.disconnect();
})

afterAll((done) => {
    httpServer.close(done);
});

test("user connects to websocket with token", async () => {

     const login = await loginUser();
     const accessToken = login.body.accessToken;

     const socket = io("http://localhost:4000", {
         auth: { token: accessToken },
         transports: ["websocket"],
         timeout:5000
     });

     await new Promise((resolve, reject) => {
         socket.on("connect", () => {
             expect(socket.connected).toBe(true);
             socket.disconnect();
             resolve();
         });

         socket.on("connect_error", (err) => {
             reject(err);
         });
     });

});
test("user joins conversation room", async () => {

     const user1 = await loginUser();
     const user2 = await createUser();

     const conversationRes = await request(app)
         .post("/api/conversations")
         .set("Authorization", `Bearer ${user1.body.accessToken}`)
         .send({ userId: user2.id });

     const conversationId = conversationRes.body._id;

     const socket = io("http://localhost:4000", {
         auth: { token: user1.body.accessToken }
     });

     await new Promise((resolve,reject) => {

         socket.on("connect", () => {
             socket.emit("joinConversation", conversationId);
             socket.disconnect();
             resolve();
         });

         socket.on("connect_error", (err) => {
             reject(err);
         })
     });
});
test("message is broadcast to conversation participants", async () => {
     const user1 = await loginUser();
     const user2 = await loginUser();
     const conversation = await request(app)
         .post('/api/conversations')
         .set('Authorization', `Bearer ${user1.body.accessToken}`)
         .send({
             userId: user2.body.user._id
         })
     const conversationId = conversation.body._id

     socket1 = io("http://localhost:4000", {
         auth: { token: user1.body.accessToken }
     });
     const socket2 = io("http://localhost:4000", {
         auth: { token: user2.body.accessToken }
     });

     await new Promise((resolve, reject) => {
         let joined = 0;
         let messageReceived = false;

         const timeout = setTimeout(() => {
             socket1.disconnect();
             socket2.disconnect();
             reject(new Error("timeout"));
         }, 10000);

         function tryStart(){
             if(joined === 2){
                 socket1.emit("sendMessage", {
                     conversationId,
                     text: "Hello"
                 });
             }
         }
         socket1.on("connect", () => {
             socket1.emit("joinConversation", conversationId);
             joined++;
             tryStart();
         })
         socket2.on("connect", () => {
             socket2.emit("joinConversation", conversationId);
             joined++;
             tryStart();
         })
         socket2.on("newMessage", message => {
             expect(message.text).toEqual("Hello");
             messageReceived = true;
         });
         socket2.on("conversationUpdated", updatedConversation => {
             const unread = updatedConversation.unreadCount[user2.body.user._id];
             if (unread === 1 && messageReceived){
                 expect(updatedConversation.lastMessage.text).toEqual("Hello")
                 expect(updatedConversation.unreadCount[user2.body.user._id]).toBe(1)
             }
             clearTimeout(timeout);
             socket1.disconnect();
             socket2.disconnect();
             resolve();
         })
     });
})
test("markAsRead resets unreadCount", async () => {
     const user1 = await loginUser();
     const user2 = await loginUser();
     const conversation = await request(app)
         .post('/api/conversations')
         .set('Authorization', `Bearer ${user1.body.accessToken}`)
         .send({
             userId: user2.body.user._id
         })
     const conversationId = conversation.body._id

     socket1 = io("http://localhost:4000", {
         auth: { token: user1.body.accessToken }
     });

     await new Promise((resolve) => {
         socket1.on("connect", () => {
             socket1.emit("markAsRead", conversationId);
         })

         socket1.on("conversationUpdated",(updatedConversation) => {
             console.log(updatedConversation)
             expect(updatedConversation.unreadCount[user1.body.user._id]).toBe(0);
             socket1.disconnect();
             resolve();
         })
     })
})