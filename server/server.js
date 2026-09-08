const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const connectDB = require("./config/dbConnection.js");




connectDB();
const app = express();

const port = process.env.PORT || 5000;

// 1. Global Middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// 2. API Routes
app.use("/api/contacts", require("./routes/contactRoute.js"));
app.use("/api/users", require("./routes/userRoute.js"));
app.use("/api", require("./routes/api.js"));
app.use('/api/auth', require("./routes/authRoutes.js"));

// 3. Custom Error Handler (MUST BE LAST)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;