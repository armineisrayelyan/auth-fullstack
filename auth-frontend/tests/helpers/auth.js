export async function createUser(request) {
    const email = `test${Date.now()}@gmail.com`;
    const password = "test123";
    await request.post('http://localhost:3000/api/auth/register',{
        data:{
            name: "Test User",
            email,
            password,
        }
    })

    return { email, password };
}