var express = require('express');
var router = express.Router();
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
const {errorPrint} = require('../helpers/debug/debugprinters');
var {postValidator} = require('../middleware/validation');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');

var storage = multer.diskStorage({
    destination: function(_, _, cb) { cb(null, "public/images/uploads"); },

    filename: function(_, file, cb) {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("upload-image"), postValidator, (req, res, next) => {
    // postValidator ensures that these variables are defined.
    // it also ensures some of them are non-empty.
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_user_id = req.session.userID;

    sharp(fileUploaded)
    .resize(200)
    .toFile(destinationOfThumbnail)
    .then(() => {
        return PostModel.create(title, description, fileUploaded, destinationOfThumbnail, fk_user_id);
    })
    .then((postWasCreated) => {
        if (postWasCreated) {
            req.flash("success", "Your post was created successfully.");
            req.session.save((_) => { res.redirect('/'); });
        } else throw new PostError("Your post could not be created.", "/postimage", 200);
    })
    .catch((err) => {
        if (err instanceof Error) {
            errorPrint(err.message);
            req.flash("error", `Your post could not be created. Reason: ${err.message}.`);

            req.session.save((_) => { res.redirect('/postimage'); });
        } else if (err instanceof PostError) {
            errorPrint(err.getMessage());
            res.status(err.getStatus());
            req.flash("error", err.getMessage());
            
            req.session.save((_) => { res.redirect(err.getRedirectURL()); });
        } else next(err);
    });
});

router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                message: "No search term given.",
                status: "error",
                results: []
            });
        } else {
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: `${results.length} results found.`,
                    status: "success",
                    results: results
                });
            } else {
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message: "No results were found for your search, but here are the 8 most recent posts.",
                    status: "info",
                    results: results
                });
            }
        }
    } catch (err) { next(err); }
});

module.exports = router;