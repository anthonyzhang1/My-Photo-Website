var express = require('express');
var router = express.Router();
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const {create} = require('../models/Comments');

router.post('/create', (req, res, next) => {
    if (!req.session.username) {
        errorPrint("User must be logged in to comment.");
        res.json({
            code: -1,
            status: "error",
            message: "You must be logged in to comment."
        });
    } else {
        let {comment, postID} = req.body;
        let username = req.session.username;
        let userID = req.session.userID;
    
        create(userID, postID, comment)
        .then((wasSuccessful) => {
            if (wasSuccessful !== -1) {
                successPrint(`A comment was created for ${username}.`);
                res.json({
                    code: 1,
                    status: "success",
                    message: "Your comment was posted.",
                    comment: comment,
                    username: username
                });
            } else {
                errorPrint("The comment was not saved.");
                req.json({
                    code: -1,
                    status: "error",
                    message: "Your comment failed to post."
                });
            }
        })
        .catch((err) => next(err));
    }
});

module.exports = router;