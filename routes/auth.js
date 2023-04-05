const express = require('express');
const router = express.Router();
const passport = require('passport');
const { logout, callback } = require('../controllers/authController');

// Login with Google OAuth
router.get(
  '/',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

// Logout and go back to homepage
router.get('/logout', logout);

// Google OAuth callback
router.get('/callback', passport.authenticate('google', {failureRedirect: '/auth'}), callback);

module.exports = router;
