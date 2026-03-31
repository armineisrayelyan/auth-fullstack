const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");
const createUser = require("../../helpers/createUser");

describe('Create conversation', () => {
    test('POST /api/conversations should create conversation', async () => {
        const participant_1 = await loginUser();
        const participant_2 = await createUser();
        const res = await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                userId: participant_2.id
            })

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body.participants.length).toBe(2);
    })

})