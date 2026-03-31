const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");

describe('Get user', () => {
    test('unauthorized request', async () => {
        await loginUser();
        const res = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer `)

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ message: 'Not authorized, token failed'});
    })

})