const mongoose = require("mongoose");
require('dotenv').config({path: '.env.test'});

const connectTestDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
};
const clearTestDB = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};
const closeTestDB = async () => {
    //await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
};

module.exports = {
    connectTestDB,
    closeTestDB,
    clearTestDB,
};