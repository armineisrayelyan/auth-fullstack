const request = require('supertest');
const app = require('../../../app')
const createUser = require("../../helpers/createUser");
const loginUser = require("../../helpers/loginUser");

describe("Logout", () => {
    test("should clear cookie and logout user", async () => {
        const login = await loginUser()
        const accessToken = login.body.accessToken

        const res =await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(res.headers['set-cookie'][0]).toContain('refreshToken=;', 'path=/', 'httpOnly','sameSite=lax');
        expect(res.statusCode).toBe(200);
    });
    test("logout without token", async () => {
        const res = await request(app)
            .post("/api/auth/logout");
        expect(res.statusCode).toBe(200);
        expect(res.headers['set-cookie'][0]).toContain('refreshToken=;', 'path=/', 'httpOnly','sameSite=lax');
    })
});