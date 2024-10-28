import passport from 'passport';
import LocalStrategy from 'passport-local';
import GoogleStrategy from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';  // sasta juggad
import User from './models/user.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// Middleware function to check if a user is authenticated
export const isVerified = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return res.redirect('/login');
   } else {
      console.log("User logged in");
      next(); // Proceed to the next middleware or route handler
   }
};