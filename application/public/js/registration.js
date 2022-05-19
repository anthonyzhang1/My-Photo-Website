/** Checks the registration form for valid inputs.
  * If all inputs are valid, submit the form. If there are invalid inputs, do not submit.
  * Instead, display the relevant error messages. */
let checkRegistrationForm = function() {
    let alertMessage = "";

    alertMessage += checkUsername();
    alertMessage += checkPassword();
    alertMessage += checkConfirmPassword();

    // If there are no alert messages, use the HTML form validation attributes
    // to check the remaining form data before submitting.
    if (alertMessage === "") {
        let registrationForm = document.getElementById("registration-form");

        // checkValidity() triggers HTML's form validation attributes.
        // If form is valid, submit. Otherwise, display error messages.
        if (registrationForm.checkValidity()) registrationForm.submit();
        else registrationForm.reportValidity();
    } // If there are alert messages, display them without the last newline character
    else alert(alertMessage.substring(0, alertMessage.length - 1));
}

/** Checks validity of the username. Returns a string of error messages if invalid.
  * Returns an empty string if the username is valid. */
let checkUsername = function() {
    const ALPHABETIC_CHARACTERS = /[a-zA-Z]/;
    const NON_ALPHANUMERIC_CHARACTERS = /[^a-zA-Z0-9]/;
    let username = document.getElementById("reg-username").value;
    let returnMessage = "";

    // Username must begin with an alphabetic character.
    if (!ALPHABETIC_CHARACTERS.test(username.charAt(0))) {
        returnMessage += "Your username must begin with an alphabetic character.\n";
    }
    
    // Username can only contain alphanumeric characters.
    if (NON_ALPHANUMERIC_CHARACTERS.test(username)) {
        returnMessage += "Your username must contain only alphanumeric characters.\n";
    }

    // Username must be at least 3 alphanumeric characters long.
    if (username.length < 3) {
        returnMessage += "Your username must be at least 3 alphanumeric characters long.\n";
    }

    return returnMessage;
}

/** Checks validity of the password. Returns a string of error messages if invalid.
  * Returns an empty string if the password is valid. */
let checkPassword = function() {
    const UPPERCASE_LETTERS = /[A-Z]/;
    const NUMBERS = /[0-9]/;
    const SPECIAL_CHARACTERS = /[/*\-+!@#$^&]/;
    let returnMessage = "";
    let password = document.getElementById("reg-password").value;

    // Password must be at least 8 characters long.
    if (password.length < 8) returnMessage += "Your password must be at least 8 characters long.\n";

    // Password must contain at least one uppercase letter, one number,
    // and one special character as defined in the SPECIAL_CHARACTERS constant.
    if (!UPPERCASE_LETTERS.test(password)) {
        returnMessage += "Your password must contain at least one uppercase letter.\n";
    } if (!NUMBERS.test(password)) {
        returnMessage += "Your password must contain at least one number.\n";
    } if (!SPECIAL_CHARACTERS.test(password)) {
        returnMessage += "Your password must contain at least one of these characters: /*-+!@#$^&\n";
    }

    return returnMessage;
}

/** Checks if the password and the confirm password match. Returns an error message string
  * if they do not match. Returns an empty string if they match. */
let checkConfirmPassword = function() {
    let returnMessage = "";
    let password = document.getElementById("reg-password").value;
    let confirmPassword = document.getElementById("reg-confirm-password").value;

    if (password !== confirmPassword) returnMessage += "Your password and confirm password must match.\n";
    
    return returnMessage;
}