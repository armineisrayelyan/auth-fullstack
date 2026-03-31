const request = require("supertest");
const app = require("../../app");
const createUser = async () => {
    const user = {
        email: `user${Date.now()}@test.com`,
        password: '123456',
        name: "Test User"
    }

    const res = await request(app)
        .post("/api/auth/register")
        .send(user);
    return {...user, id: res.body.user.id};
}
module.exports = createUser;