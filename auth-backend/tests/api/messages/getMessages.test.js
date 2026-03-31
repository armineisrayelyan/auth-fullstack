const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");
const createUser = require("../../helpers/createUser");

describe('Get Messages', ()=> {
    test("GET /api/conversations/:id/messages should return conversation messages", async () => {
        const participant_1 = await loginUser();
        const participant_2 = await createUser();
        const conversation = await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                userId: participant_2.id
            })
        const conversationId = conversation.body._id

        const res = await request(app)
            .get(`/api/conversations/${conversationId}/messages`)
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)

        expect(res.statusCode).toBe(200);
    });
})
