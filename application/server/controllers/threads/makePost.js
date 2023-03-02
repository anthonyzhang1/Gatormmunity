/* This file contains the controller that creates a forum post in a thread. */

const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require('../../helpers/Constants');
const PostModel = require('../../models/PostModel');

/**
 * Makes a post in an existing thread. The new post will not be the thread's original post,
 * since a thread's original post is created when the thread is created.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const makePost = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { body, threadId, authorId } = req.body;

    PostModel.createPost(body, false, threadId, authorId) // all new posts in a thread are not original posts
        .then((postId) => {
            if (postId === ERROR) throw new Error("Error with createPost().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "Your post could not be created due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = makePost;