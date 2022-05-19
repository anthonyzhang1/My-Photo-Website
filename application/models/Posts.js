var db = require('../config/database');
const PostModel = {};

PostModel.create = (title, description, photo_path, thumbnail, fk_user_id) => {
    let baseSQL = `INSERT INTO posts (title, description, photo_path, thumbnail, created_at, fk_user_id) 
                   VALUE (?, ?, ?, ?, now(), ?);`;

    return db.execute(baseSQL, [title, description, photo_path, thumbnail, fk_user_id])
    .then(([results]) => { return Promise.resolve(results && results.affectedRows); })
    .catch((err) => Promise.reject(err));
}

PostModel.search = (searchTerm) => {
    let baseSQL = `SELECT id, title, description, thumbnail, concat_ws(' ', title, description) AS haystack 
                   FROM posts HAVING haystack LIKE ?;`;
    let sqlReadySearchTerm = "%" + searchTerm + "%";

    return db.execute(baseSQL, [sqlReadySearchTerm])
    .then(([results]) => { return Promise.resolve(results); })
    .catch((err) => Promise.reject(err));
}

PostModel.getNRecentPosts = (numberOfPosts) => {
    let baseSQL = `SELECT id, title, description, thumbnail, created_at 
                   FROM posts ORDER BY created_at DESC LIMIT ?`;

    return db.query(baseSQL, [numberOfPosts])
    .then(([results]) => { return Promise.resolve(results); })
    .catch((err) => Promise.reject(err));
}

PostModel.getPostByID = (postID) => {
    let baseSQL = `SELECT u.username, p.title, p.description, p.photo_path, p.created_at
                   FROM users u
                   JOIN posts p
                   ON u.id=fk_user_id
                   WHERE p.id=?;`;

    return db.execute(baseSQL, [postID])
    .then(([results]) => { return Promise.resolve(results); })
    .catch((err) => Promise.reject(err));
}

module.exports = PostModel;