const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000, // Stop waiting after 5s if DB fails to connect
            socketTimeoutMS: 45000,
        });
        console.log("Database Connected......", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.error("❌ Database Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;