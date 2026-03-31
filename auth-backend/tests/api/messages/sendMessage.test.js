const request = require('supertest');
const app = require('../../../app')
const loginUser = require("../../helpers/loginUser");
const createUser = require("../../helpers/createUser");

describe('Send Messages', ()=> {
    test("POST /api/conversations/:id/messages should send a message, and update conversation last message", async () => {
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
            .post(`/api/conversations/${conversationId}/messages`)
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                text: 'Hello World!',
            })

        const conv = await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                userId: participant_2.id
            })

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('conversationId', conversationId);
        expect(res.body).toHaveProperty('text', 'Hello World!');
        expect(res.body).toHaveProperty('sender')
        expect(conv.body).toHaveProperty('lastMessage', res.body._id);
    });
    test('failed to send message', async () => {
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
            .post(`/api/conversations/${conversationId}/messages`)
            .set('Authorization', `Bearer ${participant_1.body.accessToken}`)
            .send({
                text: '',
            })

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            message: 'Message text is required'
        })

    })
})
