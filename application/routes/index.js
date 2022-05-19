var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
const {getRecentPosts, getPostByID, getCommentsByPostID} = require('../middleware/postsmiddleware');

router.get('/', getRecentPosts, function(_, res) {
  res.render('index', { title: 'Home' });
});

router.get('/login', (_, res) => {
  res.render('login', { title: 'Login' });
});

router.get('/reset-password', (_, res) => {
  res.render('resetpassword', { title: 'Reset Password' });
});

router.get('/registration', (_, res) => {
  res.render('registration', {
    css_file: 'registration.css',
    js_file: 'registration.js',
    title: 'Registration'
  });
});

router.get('/TOS-and-Privacy-Rules', (_, res) => {
  res.render('TOSandprivacyrules', { title: 'Terms of Service and Privacy Rules' });
});

router.use('/postimage', isLoggedIn); // only logged in users can post
router.get('/postimage', (_, res) => {
  res.render('postimage', {
    css_file: 'postimage.css',
    title: 'Post Image'
  });
});

router.get('/acceptable-use-policy', (_, res) => {
  res.render('acceptableusepolicy', { title: 'Acceptable Use Policy' });
});

router.get('/post/:id(\\d+)', getPostByID, getCommentsByPostID, (_, res) => {
  res.render('imagepost', {
    css_file: 'imagepost.css',
    title: res.locals.currentPost.title,
  });
});

module.exports = router;