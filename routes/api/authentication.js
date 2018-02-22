const express = require('express');
const passport = require('passport');
const User = require('../../models/user.js');

const router = express.Router();

//POST to /register
router.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  });

  // Save via passports "register" method
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      return res.send(JSON.stringify({ error: err}));
    }
    // Else, return JSON object with user info
    return res.send(JSON.stringify(user));
  });
});


//POST to /login
router.post('/login', (req, res) => {
  passport.authenticate('local')(req, res, () => {
  //If logged in, we should have info to send back
  if (req.user) {
    return res.send(JSON.stringify(req.user));
  }

  //Otherwise return an error
  return res.send(JSON.stringify({ error: 'There was an error logging in' }));
  });
});


// GET to /logout
router.get('/logout', (req, res) => {
  req.logout();
  return res.send(JSON.stringify(req.user));
});

module.exports = router;
