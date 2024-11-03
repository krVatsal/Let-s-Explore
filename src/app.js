import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import User from "./models/user.models.js";
import session from "express-session";
import MongoStore from "connect-mongo";

import mongoose from "mongoose";
import userAuthRoute from "./routes/auth.route.js";
import participantRoute from "./routes/participant.route.js";
import leaderboardRoute from "./routes/leaderboard.route.js";

dotenv.config({ path: '../.env' });

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    // origin: "http://localhost:3000",
    credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Configure Passport's local strategy for login
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        console.log("1")
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("3")
            return done(null, false, { message: 'Incorrect email or password.' });
        }
        console.log("2")
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5217/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/MnnitHunt',
        ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true
    }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", userAuthRoute); 
app.use("/api/v1", participantRoute);
app.use("/api/v1", leaderboardRoute);

export default app;