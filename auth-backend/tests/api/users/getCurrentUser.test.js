const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");

describe('Get current user', () => {
    test('GET /api/user', async () => {
        const user = await loginUser();
        const accessToken = user.body.accessToken
        const res = await request(app)
            .get('/api/user/profile')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email');
    })

})