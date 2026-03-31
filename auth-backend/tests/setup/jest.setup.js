const {
    connectTestDB,
    closeTestDB,
    clearTestDB,
} = require("./testDB");

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});