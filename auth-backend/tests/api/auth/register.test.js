const request = require('supertest');
const app = require('../../../app')
const createUser = require("../../helpers/createUser");
describe('Register', () => {
    test('should register successfully', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'user@test.com',
                password: '123456',
                name: "Test",
            })
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('user');
    })

    test("should fail if email exists", async () => {
        const user = await createUser();
        const res = await request(app).post('/api/auth/register').send(user);
        expect(res.statusCode).toBe(400);
        expect(res.body).toMatchObject({
            message: 'User already exists',
        })
    })

    test("invalid email", async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test',
                email: 'test@mailcom',
                password: '123456',
            })
        expect(res.statusCode).toBe(500);
        expect(res.text).toBe('Server error')
    })
    test("missing password", async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test',
                email: 'test@gmail.com',
            })
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            message: 'All fields are required',
        })
    })
});