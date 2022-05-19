/** Returns true if username is valid, false if invalid. */
const checkRegUsername = (username) => {
    // Regex explanation:
    // ^[a-zA-Z]: The 1st character must be an alphabetical character.
    // [a-zA-Z0-9]{2,}$: The 2nd to n characters must be alphanumeric characters.
    // Altogether, the username will contain 3 or more alphanumeric characters.
    const USERNAME_CHECKER = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    return USERNAME_CHECKER.test(username);
}

/** Returns true if the email is valid, false if invalid.
  * The email validation is not as safe as the one used by
  * HTML's input type=email attribute, but it will at least ensure that
  * the email is of the form `username@domain` or `username@domain.tld`. */
const checkEmail = (email) => {
    // Regex explanation:
    // ^\S+: Require at least one non-whitespace character before the @ symbol.
    // @: Require the @ symbol to be present in the email string.
    // \S+$: Require at least one non-whitespace character after the @ symbol.
    const EMAIL_CHECKER = /^\S+@\S+$/;
    return EMAIL_CHECKER.test(email);
}

/** Returns true if password is valid, false if invalid. */
const checkRegPassword = (password) => {
    const UPPERCASE_LETTERS = /[A-Z]/;
    const NUMBERS = /[0-9]/;
    const SPECIAL_CHARACTERS = /[/*\-+!@#$^&]/;

    // Password must be at least 8 characters long.
    if (password.length < 8) return false;

    // Password must contain at least one uppercase letter, one number,
    // and one special character as defined in the SPECIAL_CHARACTERS constant.
    if (!UPPERCASE_LETTERS.test(password) || !NUMBERS.test(password) ||
        !SPECIAL_CHARACTERS.test(password)) {
        return false;
    }

    return true; // password is valid
}

/** Validates the registration form on the server-side. If any of the fields are invalid,
  * block the registration attempt and redirect to the registration page.
  * Then, display an error message. If all fields are valid, call next(). */
const registrationValidator = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body['confirm-password'];

    if (!checkRegUsername(username)) { // check username validity
        req.flash('error', 'Invalid username.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!checkEmail(email)) { // check email validity
        req.flash('error', 'Invalid email.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!checkRegPassword(password)) { // check password validity
        req.flash('error', 'Invalid password.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (confirmPassword !== password) { // check confirmPassword validity
        // We do not explicitly check the validity of confirmPassword since
        // password has already been validated. If confirmPassword matches password,
        // then confirmPassword will also be valid.
        req.flash('error', 'Your password and confirm password must match.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!req.body['age-verification']) { // check that the age checkbox was checked
        req.flash('error', 'You must confirm that you are 13+ years of age.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!req.body['TOS-and-PR-acceptance']) { // check that the TOS checkbox was checked
        req.flash('error', 'You must accept the TOS and Privacy Rules.');
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else { // all fields are valid
        next();
    }
}

/** Validates the login form on the server-side. If any of the fields are invalid,
  * block the login attempt and redirect to the login page.
  * Then, display an error message. If all fields are valid, call next(). */
const loginValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username.length === 0) { // check if username is valid
        req.flash('error', 'A username must be entered.');
        req.session.save(err => {
            res.redirect("/login");
        });
    } else if (password.length === 0) { // check if password is valid
        req.flash('error', 'A password must be entered.');
        req.session.save(err => {
            res.redirect("/login");
        });
    } else { // all fields are valid
        next();
    }
}

/** Validates the reset password form on the server-side. If any of the fields are
  * invalid, block the reset password attempt and redirect to the reset password page.
  * Then, display an error message. If all fields are valid, call next(). */
 const resetPasswordValidator = (req, res, next) => {
    let username = req.body.username;
    let email = req.body.email;

    if (username.length === 0) { // check if username is valid
        req.flash('error', 'A username must be entered.');
        req.session.save(err => {
            res.redirect("/reset-password");
        });
    } else if (!checkEmail(email)) { // check email validity
        req.flash('error', 'Invalid email.');
        req.session.save(err => {
            res.redirect("/reset-password");
        });
    } else { // all fields are valid
        next();
    }
}

/** Validates the post data on the server-side. Ensures that the required fields have input
  * and that the MySQL parameters will not be undefined. If these conditions are not met,
  * abort the post attempt and redirect to the post page.
  * Then, display an error message. If all fields are valid, call next(). */
const postValidator = (req, res, next) => {
    let title = req.body.title;
    let description = req.body.description;
    let fk_user_id = req.session.userID;

    if (title.length === 0) {
        req.flash('error', 'A post title must be entered.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (description.length === 0) {
        req.flash('error', 'A post description must be entered.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (!req.file) { // check if a file was uploaded
        req.flash('error', 'You must select an image to upload.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (!req.body['acceptable-use-check']) { // check that the acceptable use checkbox was checked
        req.flash('error', 'You must accept the Acceptable Use Policy.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (fk_user_id.length === 0) { // check if userID is empty
        req.flash('error', 'Invalid user ID. Please try logging out and logging back in.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (!req.file.path || req.file.path.length === 0) { // check if fileUploaded is defined
        req.flash('error', 'Invalid file path.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (!req.file.filename) { // check if filename is defined
        req.flash('error', 'Invalid filename.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else if (!req.file.destination) {
        // ensure that destination is defined, which means destinationOfThumbnail will be valid
        req.flash('error', 'Invalid file destination.');
        req.session.save(err => {
            res.redirect("/postimage");
        });
    } else { // all fields are valid
        next();
    }
}

module.exports = {registrationValidator, loginValidator, resetPasswordValidator, postValidator}