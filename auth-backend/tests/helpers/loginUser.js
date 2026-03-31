const request = require("supertest");
const app = require("../../app");
const createUser = require("./createUser");
const loginUser = async () => {
    const user = await createUser();
    return await request(app)
        .post("/api/auth/login")
        .send({
            email: user.email,
            password: user.password
        });
}
module.exports = loginUser;