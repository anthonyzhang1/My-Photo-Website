var db = require("../config/database");
const CommentModel = {};

CommentModel.create = (userID, postID, comment) => {
    let baseSQL = `INSERT INTO comments (comment, fk_post_id, fk_author_id) VALUES (?,?,?);`;

    return db.query(baseSQL, [comment, postID, userID])
    .then(([results]) => {
        if (results && results.affectedRows) return Promise.resolve(results.insertId);
        else return Promise.resolve(-1);
    })
    .catch((err) => Promise.reject(err));
}

CommentModel.getCommentsForPost = (postID) => {
    let baseSQL = `SELECT u.username, c.comment, c.created_at, c.id
                   FROM comments c
                   JOIN users u
                   ON u.id=fk_author_id
                   WHERE c.fk_post_id=?
                   ORDER BY c.created_at DESC;`;

    return db.query(baseSQL, [postID])
    .then(([results]) => { return Promise.resolve(results); })
    .catch((err) => Promise.reject(err));
}

module.exports = CommentModel;