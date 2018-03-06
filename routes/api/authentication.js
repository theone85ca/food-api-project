const appConfig = require('../../config.js');
const express = require('express');
const mailgun = require('mailgun-js')({
  apiKey: appConfig.mailgun.apiKey,
  domain: appConfig.mailgun.domain,
});
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../models/user.js');
const crypto = require('crypto');

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
router.post('/register', async (req, res) => {
  // First, check and make sure the email doesn't already exist
  const query = User.findOne({ email: req.body.email });
  const foundUser = await query.exec();
    if (foundUser) { return res.send(JSON.stringify({ error: 'Email or username already exists' })); }
  if (!foundUser) {
    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
})

  // Save via passports "register" method
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      return res.send(JSON.stringify({ error: 'We could not register that user as there was an error' }));
    }
    // Otherwise log them in
    return passport.authenticate('local')(req, res, () => {
      // If logged in, we should have information to send back
      if (req.user) {
        return res.send(JSON.stringify(req.user));
      }
      // Otherwise return an error
      return res.send(JSON.stringify({ error: 'There was an error registering the user' }))
    });
  });
};
});


// POST to saveresethash
router.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure their email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // if the user exists, save their password hash
    const timeInMS = Date.now();
    const hashString = '${req.body.email}${timeInMS}';
    const secret = appConfig.crypto.secret;
    const hash = crypto.createHmac ('sha256', secret)
      .update(hashString)
      .digest('hex');
    foundUser.passwordReset = hash;

    foundUser.save((err) => {
      if (err) { result = res.send(JSON.stringify({ error: 'Something went wrong whilst attempting to reset your password. Please try again.' })); }

      // Put together the email
      const emailData = {
        from: `SomeName <postmaster@${appConfig.mailgun.domain}>`,
        to: foundUser.email,
        subject: 'Reset Your Password',
        text: `A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: https://musiclist.com/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: <a href="https://musiclist.com/account/change-password/${foundUser.passwordReset}&quot; target="_blank">https://musiclist.com/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
      };

      // Send it
      mailgun.messages().send(emailData, (error, body) => {
        if (error || !body) {
          result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send the email. Please try again. MailGun' }));
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });

    });
  } catch (err) {
    // If the user doesn't exist, error out.
    result = res.send(JSON.stringify({ error: 'Something went wrong whilst attempting to reset your password. Please try again.' }));
  }
  return result;
});






module.exports = router;
