const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a User
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    if (!firstname || !lastname || !email || !phone || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const normalizedEmail = email.toLowerCase();
    const userAvailable = await User.findOne({ email: normalizedEmail });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash(password, 10);

    const username = `${firstname} ${lastname}`.trim();

    const user = await User.create({
        username,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
    });

    if (user) {
        return res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

//@desc Login User Info
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Either email or password is invalid");
    }
});

//@desc Current User
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

//@desc Get All Users for RightRegi
//@route GET /api/users
//@access public
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password"); // Fetch all users without returning hashed passwords
    res.status(200).json(users);
});

module.exports = { registerUser, loginUser, currentUser, getUsers };