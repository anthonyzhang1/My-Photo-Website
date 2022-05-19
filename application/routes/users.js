var express = require('express');
var router = express.Router();
const UserModel = require('../models/Users');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const UserError = require('../helpers/error/UserError');
const {registrationValidator, loginValidator,
       resetPasswordValidator} = require('../middleware/validation');

router.use('/register', registrationValidator); // validates registration form data
router.post('/register', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  UserModel.usernameExists(username)
  .then((userDoesExist) => {
    if (userDoesExist) {
      throw new UserError("Registration Failed: Username already exists.", "/registration", 200);
    } else return UserModel.emailExists(email);
  })
  .then((emailDoesExist) => {
    if (emailDoesExist) {
      throw new UserError("Registration Failed: Email already exists.", "/registration", 200);
    } else return UserModel.create(username, email, password);
  })
  .then((createdUserID) => {
    if (createdUserID < 0) {
      throw new UserError("Server Error: User could not be created.", "/registration", 500);
    } else {
      successPrint(`User ${username} was created.`);
      req.flash('success', 'User account successfully created.');

      req.session.save(_ => { res.redirect('/login'); });
    }
  })
  .catch((err) => {
    errorPrint('User could not be made.', err);

    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      req.flash('error', err.getMessage());

      req.session.save(_ => { res.redirect(err.getRedirectURL()); });
    } else next(err);
  });
});

router.use('/login', loginValidator); // validates login form data
router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  UserModel.authenticate(username, password)
  .then((loggedUserID) => {
    if (loggedUserID > 0) {
      successPrint(`User ${username} has logged in.`);
      req.session.username = username;
      req.session.userID = loggedUserID;
      res.locals.logged = true;
      req.flash('success', 'You have successfully logged in.');

      req.session.save(_ => { res.redirect('/'); });
    } else throw new UserError("Invalid username and/or password.", "/login", 200);
  })
  .catch((err) => {
    errorPrint("User login failed.");

    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      req.flash('error', err.getMessage());

      req.session.save(_ => { res.redirect(err.getRedirectURL()); });
    } else next(err);
  });
});

router.use('/reset-password', resetPasswordValidator); // validates reset password form data
router.post('/reset-password', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;

  UserModel.checkUsernameAndEmail(username, email)
  .then((userID) => {
    if (userID > 0) { // username and email valid
      req.flash('success', `A link to reset your password has been sent to ${email}.
                            (We did not actually send anything.)`);

      req.session.save(_ => { res.redirect('/reset-password'); });
    } else { // invalid username or email
      throw new UserError("No account exists with that username and email.", "/reset-password", 200);
    }
  })
  .catch((err) => {
    if (err instanceof UserError) {
      errorPrint(err.getMessage());
      res.status(err.getStatus());
      req.flash('error', err.getMessage());

      req.session.save(_ => { res.redirect(err.getRedirectURL()); });
    } else next(err);
  });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("Session could not be destroyed.");
      next(err);
    } else {
      successPrint("Session successfully destroyed.");
      res.clearCookie('csid');
      res.json({status: "OK", message: "User logged out."});
    }
  });
});

module.exports = router;