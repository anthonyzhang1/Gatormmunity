/* This file contains the controller that deletes forum posts. It does not delete original posts, however. */

const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const PostModel = require('../../models/PostModel');

/**
 * Deletes a post, as long as it is not the original (first) post of a thread.
 * Since only an original post can have images, we do not need to check if the post contains images.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const deletePost = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { postId } = req.body;

    PostModel.isOriginalPost(postId) // check to make sure we are not deleting an original post
        .then((isOriginalPost) => {
            if (isOriginalPost === ERROR) throw new CustomError("There is no post with that id.");
            else if (isOriginalPost) throw new CustomError("You cannot delete original posts.");

            return PostModel.deletePost(postId); // safely delete the post
        })
        .then((deletedPostId) => {
            if (deletedPostId === ERROR) throw new Error("Error with deletePost().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the post due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = deletePost;