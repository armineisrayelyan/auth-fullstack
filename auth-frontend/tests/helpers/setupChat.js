export async function setupChat(request) {
    const email1=`user1_${Date.now()}@test.com`;
    const email2=`user2_${Date.now()}@test.com`;
    const password = "test123";
    const user1Res = await request.post('http://localhost:3000/api/auth/register',{
        data:{
            name: "User1",
            email: email1,
            password
        }
    })
    const user2Res = await request.post('http://localhost:3000/api/auth/register',{
        data:{
            name: "User2",
            email: email2,
            password
        }
    })
    const user1 = await user1Res.json();
    const user2 = await user2Res.json();
    const conv = await request.post('http://localhost:3000/api/conversations',{
        data: {
            userId: user2.user.id,
        },
        headers: {
            Authorization: `Bearer ${user1.accessToken}`
        }
    })
    const conversationId = (await conv.json())._id

    return{
        user1,
        user2,
        conversationId,
    };
}