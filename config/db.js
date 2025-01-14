const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected successfully.');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = dbConnection;