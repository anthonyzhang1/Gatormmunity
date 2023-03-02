const database = require("../config/dbConfig");
const PostModel = {}; // all of the functions are stored here, which are then exported

/**
 * Inserts a new attachment into the database.
 * 
 * @param {string} filename The original filename of the attachment before it was randomized and stored on our file system.
 * @param {string} image_path The path of the original image.
 * @param {string} thumbnail_path The path of the thumbnail of the image.
 * @param {int} post_id The id of the post this attachment is associated with.
 * @returns On success, the new attachment's attachment_id. On failure, -1.
 */
PostModel.createAttachment = (filename, image_path, thumbnail_path, post_id) => {
    const insertSQL = `INSERT INTO attachment (filename, image_path, thumbnail_path, post_id)
                       VALUES (?, ?, ?, ?);`;

    return database
        .query(insertSQL, [filename, image_path, thumbnail_path, post_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
}

/**
 * Inserts a new post into the database.
 * 
 * @param {string} body The body of the thread.
 * @param {boolean} is_original_post Whether the post is the original post, i.e. the post created when the thread is created.
 * @param {int} thread_id The id of the thread the post belongs to.
 * @param {int} author_id The id of the user who created the post.
 * @returns On success, the new post's post_id. On failure, -1.
 */
PostModel.createPost = (body, is_original_post, thread_id, author_id) => {
    const insertSQL = `INSERT INTO post (body, is_original_post, thread_id, author_id)
                       VALUES (?, ?, ?, ?);`;

    return database
        .query(insertSQL, [body, is_original_post, thread_id, author_id])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/** Deletes the post from the database.
  * On successful deletion, returns the deleted post's id. Otherwise, returns -1. */
PostModel.deletePost = (post_id) => {
    const deleteQuery = `DELETE FROM post
                         WHERE post_id = ?;`;

    return database
        .query(deleteQuery, [post_id])
        .then(([results]) => {
            if (results.affectedRows) return post_id;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Tells whether a post is an original post or not.
 * 
 * @param {int} post_id The id of the post to check.
 * @returns 1, if the post is an original post. 0, if not. -1, if there was no post with the provided post_id.
 */
PostModel.isOriginalPost = (post_id) => {
    const selectSQL = `SELECT is_original_post
                       FROM post
                       WHERE post_id = ?;`;

    return database
        .query(selectSQL, [post_id])
        .then(([results]) => {
            if (results.length) return results[0].is_original_post;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Finds the user's last `numPosts` created Gatormmunity Forum posts, and selects the parent thread's id and title,
 *     the post's creation date, as well as the type ("P"). It only selects the non-original post posts.
 * 
 * @param {int} user_id The id of the user we are doing the search for.
 * @param {int} numPosts The number of posts to return.
 * @returns On success, the array of threads. Otherwise, -1.
 */
PostModel.getUserNGatorReplyPostThreadTitles = (user_id, numPosts) => {
    const selectSQL = `SELECT t.thread_id, t.title, p.creation_date, "P" AS type
                       FROM thread t
                       INNER JOIN post p ON t.thread_id = p.thread_id
                       INNER JOIN user u ON p.author_id = u.user_id
                       WHERE u.user_id = ? AND p.is_original_post = 0 AND t.group_id IS NULL
                       ORDER BY p.post_id DESC
                       LIMIT ?;`;

    return database
        .query(selectSQL, [user_id, numPosts])
        .then(([results]) => {
            if (results) return results;
            else return -1;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = PostModel;