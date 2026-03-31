const request = require("supertest");
const app = require("../../app");
const {server} = require("../../server");
const connectSocket = require("../helpers/socket")
const loginUser = require("../helpers/loginUser");

let httpServer;
let socket1;
let socket2;
beforeAll((done) => {
    httpServer = server.listen(4000, ()=>{done()});
});

afterEach(() => {
    if (socket1?.connected) socket1.disconnect();
    if (socket2?.connected) socket2.disconnect();
});

afterAll((done) => {
    httpServer.close(done);
});

test("full chat flow (E2E)", async () => {
    const email1 = `user1_${Date.now()}@test.com`;
    const email2 = `user2_${Date.now()}@test.com`;
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "User1",
            email: email1,
            password: "password1",
        })

    await request(app)
        .post("/api/auth/register")
        .send({
            name: "User2",
            email: email2,
            password: "password2",
        })

    const user1Login = await request(app)
        .post("/api/auth/login")
        .send({
            email: email1,
            password: "password1"
        })

    const user2Login = await request(app)
        .post("/api/auth/login")
        .send({
            email: email2,
            password: "password2"
        })

    const token1 = user1Login.body.accessToken;
    const token2 = user2Login.body.accessToken;
    const conversation = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${token1}`)
        .send({
            userId: user2Login.body.user._id
        })

    const conversationId = conversation.body._id

    socket1 = connectSocket(token1)
    socket2 = connectSocket(token2)

    await new Promise((resolve,reject) => {
        let joined = 0;
        let messageReceived = false;

        const timeout = setTimeout(() => {
            reject(new Error("E2E timeout"));
        }, 15000);

        function tryStart(){
            if(joined ===2){
                socket1.emit("sendMessage", {
                    conversationId,
                    text: "Hello"
                });
            }
        }
        socket1.on("connect", ()=>{
            socket1.emit("joinConversation", conversationId)
            joined++;
            tryStart();
        })
        socket2.on("connect", ()=>{
            socket2.emit("joinConversation", conversationId)
            joined++;
            tryStart();
        })

        socket2.on("newMessage", message => {
            expect(message.text).toEqual("Hello")
            messageReceived = true;
        })
        socket2.on("conversationUpdated", conv => {
            const unread = conv.unreadCount[user2Login.body.user._id];
            if (unread === 1 && messageReceived){
                expect(conv.lastMessage.text).toEqual("Hello")
                expect(conv.unreadCount[user2Login.body.user._id]).toBe(1)
                socket2.emit("markAsRead", conversationId)
            }
            if (unread === 0 && messageReceived){
                expect(conv.unreadCount[user2Login.body.user._id]).toBe(0)
                clearTimeout(timeout);
                socket1.disconnect();
                socket2.disconnect();
                resolve();
            }
        })
    })
})
test("user receives message from another conversation without joining it", async () => {
    const user1 = await loginUser();
    const user2 = await loginUser();

    const conversation = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${user1.body.accessToken}`)
        .send({ userId: user2.body.user._id });

    const conversationId = conversation.body._id;
    socket1 = connectSocket(user1.body.accessToken);
    socket2 = connectSocket(user2.body.accessToken);

    await new Promise(async(resolve,reject) => {
        const timeout = setTimeout(() => {
            socket1.disconnect();
            socket2.disconnect();
            reject(new Error("timeout"));
        }, 15000);
        await new Promise(res => socket1.once("connect", res));
        await new Promise(res => socket2.once("connect", res));

        // socket1.on("connect", () => {
        //     user1Ready = true;
        //     maybeSend()
        // })
        // socket2.on("connect", () => {
        //     user2Ready = true;
        //     maybeSend()
        // })
        await new Promise(r => setTimeout(r, 100));
        // function maybeSend(){
        //     if (user1Ready && user2Ready) {
        //         socket1.emit("sendMessage", {
        //             conversationId,
        //             text: 'Hello fr5om another conversation'
        //         });
        //     }
        // }

        socket2.once("newMessage", message => {
            expect(message.text).toEqual("Hello from another conversation")
            clearTimeout(timeout);
            socket1.disconnect();
            socket2.disconnect();
            resolve();
        });
        socket1.emit("sendMessage", {
            conversationId,
            text: 'Hello from another conversation'
        });
    })
})
test("user not in conversation cannot send message", async () => {

    const user1 = await loginUser();
    const user2 = await loginUser();
    const user3 = await loginUser();

    const conversation = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${user1.body.accessToken}`)
        .send({ userId: user2.body.user._id });

    const conversationId = conversation.body._id;

    const socket3 = connectSocket(user3.body.accessToken);

    await new Promise((resolve, reject) => {

        const timeout = setTimeout(() => {
            socket3.disconnect();
            resolve()
        }, 3000);

        socket3.on("connect", () => {
            socket3.emit("sendMessage", {
                conversationId,
                text: "Hacker message"
            });
        });

        socket3.on("newMessage", (message) => {
            clearTimeout(timeout);
            socket3.disconnect();
            reject(new Error("Unauthorized message delivered"));
        });

    });

});
test("should not create duplicate conversation", async () => {

    const user1 = await loginUser();
    const user2 = await loginUser();

    const res1 = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${user1.body.accessToken}`)
        .send({ userId: user2.body.user._id });

    const res2 = await request(app)
        .post("/api/conversations")
        .set("Authorization", `Bearer ${user1.body.accessToken}`)
        .send({ userId: user2.body.user._id });

    expect(res1.body._id).toBe(res2.body._id);
});