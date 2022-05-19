var db = require('../config/database');
var bcrypt = require('bcrypt');
const UserModel = {};

UserModel.create = (username, email, password) => {
    return bcrypt.hash(password, 15)
    .then((hashedPassword) => {
        let baseSQL = `INSERT INTO users (username, email, password, created_at)
                       VALUES (?, ?, ?, now());`;

        return db.execute(baseSQL, [username, email, hashedPassword]);
    })
    .then(([results]) => {
        if (results && results.affectedRows) return Promise.resolve(results.insertId);
        else return Promise.resolve(-1);
    })
    .catch(err => Promise.reject(err));
}

UserModel.usernameExists = (username) => {
    return db.execute("SELECT * FROM users WHERE username=?", [username])
    .then(([results]) => { return Promise.resolve(!(results && results.length === 0)); })
    .catch(err => Promise.reject(err));
}

UserModel.emailExists = (email) => {
    return db.execute("SELECT * FROM users WHERE email=?", [email])
    .then(([results]) => { return Promise.resolve(!(results && results.length === 0)); })
    .catch(err => Promise.reject(err));
}

UserModel.authenticate = (username, password) => {
    let userID;
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";

    return db.execute(baseSQL, [username])
    .then(([results]) => {
        if (results && results.length === 1) {
            userID = results[0].id;
            return bcrypt.compare(password, results[0].password);
        } else return Promise.resolve(-1);
    })
    .then((passwordsMatch) => {
        if (passwordsMatch) return Promise.resolve(userID);
        else return Promise.resolve(-1);
    })
    .catch(err => Promise.reject(err));
}

/** Checks that the given username and email are valid. The email must belong to
  * the same account the username belongs to. Returns the userID of the account
  * on success. Returns -1 if the username or the email are invalid. */
UserModel.checkUsernameAndEmail = (username, email) => {
    let baseSQL = "SELECT id, username, email FROM users WHERE username=?;";

    return db.execute(baseSQL, [username])
    .then(([results]) => {
        if (results && results.length === 1) { // account with the given username found
            let userID = results[0].id;

            // check if the email entered matches the email in the database
            if (email === results[0].email) return Promise.resolve(userID);
            else return Promise.resolve(-1);
        } else return Promise.resolve(-1); // no account with the given username found
    })
    .catch(err => Promise.reject(err));
}

module.exports = UserModel;