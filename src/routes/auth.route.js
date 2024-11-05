import { Router } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { isVerified } from "../middlewares/auth.middleware.js";

const router = Router();

// Google authentication routes
router.route('/google').get(passport.authenticate('google', { scope: ['profile', 'email'] }));
router.route('/google/callback').get(passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/Event',
    failureRedirect: '/login'
}));

// Local login route
router.route("/login").post((req, res, next) => {
    console.log("Login attempt:", req.body); // Logs the login attempt
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            console.log("Login failed:", info);
            return res.status(401).json({ message: "Invalid email or password" });
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            console.log("Login successful:", user);
            return res.status(200).json({ user,message: "Logged in successfully" });
        });
    })(req, res, next);
});


// Registration route
router.route("/signup").post(async (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        // Save the new user in the database
        await newUser.save();

        // Automatically log in the new user
        req.login(newUser, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(201).json({ message: "User registered and logged in successfully" });
        });
    } catch (error) {
        res.status(500).json({ user,message: "Error registering user", error });
    }
});

router.get('/user', isVerified, (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
});

export default router;
