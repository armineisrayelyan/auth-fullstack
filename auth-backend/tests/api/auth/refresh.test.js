const request = require('supertest');
const app = require('../../../app')
const createUser = require("../../helpers/createUser");
const loginUser = require("../../helpers/loginUser");

describe("Refresh Token", () => {

    test("should refresh access token", async () => {
        const login = await loginUser()
        const cookies = login.headers["set-cookie"];
        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");
    });
    test("should return 401 if refresh token missing", async () => {

        const res = await request(app)
            .post("/api/auth/refresh");

        expect(res.statusCode).toBe(401);

    });
    test("should return 403 if refresh token invalid", async () => {

        const res = await request(app)
            .post("/api/auth/refresh")
            .set("Cookie", ["refreshToken=invalidtoken"]);

        expect(res.statusCode).toBe(403);

    });
});