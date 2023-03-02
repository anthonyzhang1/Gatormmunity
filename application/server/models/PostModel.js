/* This file contains all of the database queries related to the post and attachment table. */

const database = require("../config/dbConfig");
const { ERROR, FORUM_POST_TYPE_CHAR } = require("../helpers/Constants");
const PostModel = {}; // all of the functions are stored here, which are then exported

/**
 * Inserts a new attachment into the database associated with the specified post.
 * 
 * @param {string} originalFilename The filename of the attachment before it was randomized.
 * @param {string} imagePath The path of the image.
 * @param {string} thumbnailPath The path of the image thumbnail.
 * @param {int} postId The id of the post the attachment will be associated with.
 * @returns On successful creation, the new attachment's id. Otherwise, ERROR.
 */
PostModel.createAttachment = (originalFilename, imagePath, thumbnailPath, postId) => {
    const insertSQL = `INSERT INTO attachment (filename, image_path, thumbnail_path, post_id)
                       VALUES (?, ?, ?, ?);`;

    return database.query(insertSQL, [originalFilename, imagePath, thumbnailPath, postId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Inserts a post into the database.
 * 
 * @param {string} body The body of the post.
 * @param {boolean} isOriginalPost Whether the post is the original post: the initial post created when the thread is created.
 * @param {int} threadId The id of the thread the post belongs to.
 * @param {int} authorId The id of the user who created the post.
 * @returns On successful creation, the new post's id. Otherwise, ERROR.
 */
PostModel.createPost = (body, isOriginalPost, threadId, authorId) => {
    const insertSQL = `INSERT INTO post (body, is_original_post, thread_id, author_id)
                       VALUES (?, ?, ?, ?);`;

    return database.query(insertSQL, [body, isOriginalPost, threadId, authorId])
        .then(([results]) => {
            if (results.affectedRows) return results.insertId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Deletes the post from the database.
 * 
 * @param {int} postId The id of the post to delete.
 * @returns On successful deletion, `postId`. Otherwise, ERROR.
 */
PostModel.deletePost = (postId) => {
    const deleteSQL = `DELETE FROM post
                       WHERE post_id = ?;`;

    return database.query(deleteSQL, [postId])
        .then(([results]) => {
            if (results.affectedRows) return postId;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Finds the user's last `numPosts` created Gatormmunity Forum posts, and gets their parent thread's id and title,
 * the post's creation date, and the type (FORUM_POST_TYPE_CHAR). This only selects non-original posts.
 * 
 * @param {int} userId The id of the user we are doing the search for.
 * @param {int} numPosts The maximum number of posts to return.
 * @returns The array of threads, or ERROR on error.
 */
PostModel.getUserNLastGatorThreadsPostedIn = (userId, numPosts) => {
    const selectSQL = `SELECT t.thread_id, t.title, p.creation_date, ? AS type
                       FROM thread t
                       INNER JOIN post p ON t.thread_id = p.thread_id
                       INNER JOIN user u ON p.author_id = u.user_id
                       WHERE u.user_id = ? AND p.is_original_post = 0 AND t.group_id IS NULL
                       ORDER BY p.post_id DESC
                       LIMIT ?;`;

    return database.query(selectSQL, [FORUM_POST_TYPE_CHAR, userId, numPosts])
        .then(([results]) => {
            if (results) return results;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

/**
 * Tells whether a post is an original post.
 * 
 * @param {int} postId The id of the post to check.
 * @returns 1, if the post is an original post. 0, if not. ERROR, if a post was not found.
 */
PostModel.isOriginalPost = (postId) => {
    const selectSQL = `SELECT is_original_post
                       FROM post
                       WHERE post_id = ?;`;

    return database.query(selectSQL, [postId])
        .then(([results]) => {
            if (results.length) return results[0].is_original_post;
            else return ERROR;
        })
        .catch((err) => Promise.reject(err));
};

module.exports = PostModel;