const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../models/user.js');

const router = express.Router();

// configure mongoose promises
mongoose.Promise = global.Promise;

// GET to check session
router.get('/checksession', (req, res) => {
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }
  return res.send(JSON.stringify({}));
});

// GET to /logout
router.get('/logout', (req, res) => {
  req.logout();
  return res.send(JSON.stringify(req.user));
});


//POST to /login
router.post('/login', async (req, res) => {
  // lookup the user by their email
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();

  //if they exist, add username to the body.
  if (foundUser) { req.body.username = foundUser.username; }

  passport.authenticate('local')(req, res, () => {
  //If logged in, we should have info to send back
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }

  //Otherwise return an error
  return res.send(JSON.stringify({ error: 'There was an error logging in' }));
  });
});


//POST to /register
router.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });

  // Save via passports "register" method
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      return res.send(JSON.stringify({ error: err}));
    }
    // Otherwise log them in
    return passport.authenticate('local')(req, res, () => {
      // If logged in, we should have information to send back
      if (req.user) {
        return res.send(JSON.stringify(req.user));
      }
      // Otherwise return an error
      return res.send(JSON.stringify({ error: 'There was an error logging in' }))
    });
  });
});

module.exports = router;
