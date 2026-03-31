const request = require('supertest');
const app = require("../../server");
const {server} = require("../../server");
const connectSocket = require("../helpers/socket")
const { generateExpiredToken } = require("../helpers/generateExpiredToken")

let httpServer;

beforeAll((done) => {
    httpServer = server.listen(4000, ()=>{done()});
});

afterAll((done) => {
    httpServer.close(done);
});
test("socket connection fails with invalid token", async () => {

    const socket = connectSocket("INVALID_TOKEN");

    await new Promise((resolve) => {

        socket.on("connect_error", (err) => {
            expect(err).toBeDefined();
            socket.disconnect();
            resolve();
        });

    });

});
test("socket connection fails without token", async () => {

    const {io} = require('socket.io-client');
    const socket = io("http://localhost:4000", {
        transports: ["websocket"]
    });

    await new Promise((resolve) => {

        socket.on("connect_error", (err) => {
            expect(err).toBeDefined();
            socket.disconnect();
            resolve();
        });

    });

});
test("socket connection fails with expired token", async () => {

    const expiredToken = generateExpiredToken();
    const socket = connectSocket(expiredToken);

    await new Promise((resolve) => {
        socket.on("connect_error", (err) => {
            expect(err).toBeDefined();
            socket.disconnect();
            resolve();
        });

    });

});