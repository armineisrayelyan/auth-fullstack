const request = require('supertest');
const app = require('../../../app')
const createUser = require("../../helpers/createUser");
const loginUser = require("../../helpers/loginUser");
describe("Login", () => {
    test("should login successfully", async () => {
        const res =await loginUser()

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("accessToken");

    });
    test('wrong password', async () => {
        const user = await createUser();
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: 'wrong_password'
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({message: 'Invalid credentials'});
    })
    test('user not found', async () => {
        const user = await createUser();
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: 'testuser@gmsil.com',
                password: user.password
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({message: 'Invalid credentials'});
    })
});