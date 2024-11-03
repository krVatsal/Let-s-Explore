import { Router } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

const router = Router();

router.route('/google').get(passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.route("/google/callback").get( passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.route("/login").post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));


export default router;
