const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/users');
const mongoose = require('mongoose');
require('dotenv').config();

// Configure Google OAuth 2.0 strategy
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: '/auth/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // if user already exists, return it
          return done(null, user);
        } else {
          // if user does not exist, create a new user
          const newUser = new User({
            googleId: profile.id,
            userEmail: profile.email,
            userName: profile.displayName,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// deserialize user from session
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

exports.logout = function (req, res) {
  req.logout(() => {
    res.redirect('/');
  });
};

exports.callback = function (req, res) {
  // redirect user to homepage
  res.redirect('/');
};
