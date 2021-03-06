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
      userRegisterd: true,
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
        text: `A password reset has been requested for the RaspiViv account connected to this email address. If you made this request, please click the following link: https://raspiviv.com/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the RaspiViv account connected to this email address. If you made this request, please click the following link: <a href="https://musiclist.com/account/change-password/${foundUser.passwordReset}&quot; target="_blank">https://raspiviv.com/account/change-password/${foundUser.passwordReset}</a>.</p><p>If you didn't make this request, feel free to ignore it!</p>`,
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



// POST to savepassword
router.post('/savepassword', async (req, res) => {
  let result;
  try {
    // look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();

    // If the user exists save their new password
    if (foundUser) {
      // user passport's built-in password set method
      foundUser.setPassword(req.body.password, (err) => {
        if (err) {
          result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
        } else {
          // once the password's set, save the user object
          foundUser.save((error) => {
            if (error) {
              result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
            } else {
              // Send a success message
              result = res.send(JSON.stringify({ success: true }));
            }
          });
        }
      });
    } else {
      result = res.send(JSON.stringify({ error: 'Reset hash not found in database.' }));
    }
  } catch (err) {
    // if the hash didn't bring up a user, error out
    result = res.send(JSON.stringify({ error: 'There was an error connecting to the database.' }));
  }
  return result;
});

module.exports = router;
