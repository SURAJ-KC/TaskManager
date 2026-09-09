const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler.js");
const connectDB = require("./config/dbConnection.js");

connectDB();
const app = express();

const port = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://suraj-kc.github.io",
];

// Configure CORS Options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    // Clean origin strings by stripping any trailing slash
    const cleanOrigin = origin.replace(/\/$/, "");

    const isAllowed = allowedOrigins.some((allowed) => {
      const cleanAllowed = allowed.replace(/\/$/, "");
      return cleanOrigin === cleanAllowed;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // Pass null, false so CORS responds cleanly without throwing an unhandled exception to middleware
      callback(null, false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200, // 200 works better than 204 across all browsers for preflights
};

// 1. Global CORS Middleware (handles standard requests + preflight OPTIONS automatically)
app.use(cors(corsOptions));

app.use(express.json());

// 2. API Routes
app.use("/api/contacts", require("./routes/contactRoute.js"));
app.use("/api/users", require("./routes/userRoute.js"));
app.use("/api", require("./routes/api.js"));
app.use("/api/auth", require("./routes/authRoutes.js"));

// 3. Custom Error Handler (MUST BE LAST)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;