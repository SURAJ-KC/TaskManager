
const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const connectDB = require("./config/dbConnection.js");
const router = require("./routes/contactRoute.js");



connectDB();
const app = express();

const port =process.env.PORT || 500;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Vite default ports
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(errorHandler)
app.use("/api/contacts", require("./routes/contactRoute.js"));
app.use("/api/users", require("./routes/userRoute.js"));
app.use('/api', require("./routes/api.js"));


app.listen(port, ()=>{
    console.log(`server running on  the port ${port}`);
})

module.exports = app;