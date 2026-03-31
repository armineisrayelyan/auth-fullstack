const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");
const createUser = require("../../helpers/createUser");

describe('Get conversations', ()=> {
    test("GET /api/conversations/ should return existing conversations", async () => {
        const participant_1 = await loginUser();
        const participant_2 = await createUser();
        await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                userId: participant_2.id
            })

        const res = await request(app)
            .get('/api/conversations')
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);

    });
})
