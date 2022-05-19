const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const routeProtectors = {};

routeProtectors.userIsLoggedIn = function(req, res, next) {
    if (req.session.username) { // user is logged in
        successPrint("User is logged in.");
        next();
    } else { // user is not logged in
        errorPrint("User is not logged in.");
        req.flash('error', 'You must be logged in to create a post.');

        req.session.save((saveErr) => {
            res.redirect('/login');
        });
    }
}

module.exports = routeProtectors;