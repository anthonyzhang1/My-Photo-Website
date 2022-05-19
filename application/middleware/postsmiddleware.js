const {getNRecentPosts, getPostByID} = require('../models/Posts');
const {getCommentsForPost} = require('../models/Comments');
const postMiddleware = {};

postMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await getNRecentPosts(8);
        res.locals.results = results;
        if (results.length === 0) req.flash('error', 'There are no posts created yet.');
        next();
    } catch (err) { next(err); }
}

postMiddleware.getPostByID = async function(req, res, next) {
    try {
        let postID = req.params.id;
        let results = await getPostByID(postID);

        if (results && results.length) {
            res.locals.currentPost = results[0];
            next();
        } else {
            req.flash("error", "This is not the post you are looking for.");
            req.session.save(_ => { res.redirect('/'); });
        }
    } catch (err) { next(err); }
}

postMiddleware.getCommentsByPostID = async function(req, res, next) {
    let postID = req.params.id;

    try {
        let results = await getCommentsForPost(postID);
        res.locals.currentPost.comments = results;
        next();
    } catch (err) { next(err) }
}

module.exports = postMiddleware;