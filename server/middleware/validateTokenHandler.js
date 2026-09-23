const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        // Guard against literal "null" or "undefined" strings from localStorage
        if (!token || token === "null" || token === "undefined") {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }

        try {
            // ✅ Fixed spelling: ACCESS_TOKEN_SECRET
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.user;
            return next();
        } catch (err) {
            res.status(401);
            throw new Error("User is not authorized or token expired");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
});

module.exports = validateToken;