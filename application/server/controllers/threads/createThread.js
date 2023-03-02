/* This file contains the controller that creates threads and post thumbnails. */

const path = require("path");
const fs = require("fs");
const { ERROR_STATUS, SUCCESS_STATUS, ERROR, SKIP } = require("../../helpers/Constants");
const createThumbnail = require("../../helpers/CreateThumbnail");
const PostModel = require('../../models/PostModel');
const ThreadModel = require('../../models/ThreadModel');

/**
 * Creates a thread either for Gatormmunity or for a group, depending on if a group id is provided by the front end.
 * The thread's original post is created too. If an image was provided, then a thumbnail will be created.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * threadId: {int} The id of the new thread.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createThread = (req, res) => {
    /** The width of the thumbnail to be created, in pixels. */
    const THUMBNAIL_WIDTH = 250;
    /** The height of the thumbnail to be created, in pixels. */
    const THUMBNAIL_HEIGHT = 250;

    const { threadTitle, threadBody, category, groupId, creatorId } = req.body;
    let returnData = {}; // holds the data that will be sent to the front end

    /* The thread image is optional, thus we check if `req.file` exists first before assigning these variables a value. */
    const threadImagePath = req.file ? req.file.path : null;
    const threadImageThumbnailPath = req.file ? path.join(req.file.destination, `tn-${req.file.filename}`) : null;
    const threadImageOriginalFilename = req.file ? req.file.originalname : null;

    createThumbnail(req.file, threadImagePath, threadImageThumbnailPath, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
        .then(() => {
            // if the thumbnail was successfully created, create the thread
            return ThreadModel.createThread(threadTitle, category, groupId, creatorId);
        })
        .then((threadId) => {
            if (threadId === ERROR) throw new Error("Error with createThread().");

            returnData.threadId = threadId;
            return PostModel.createPost(threadBody, true, threadId, creatorId); // create the thread's initial post
        })
        .then((postId) => {
            if (postId === ERROR) throw new Error("Error with createPost().");

            // If a thread image was provided, attach it to the post, otherwise, we are done and can send back `returnData`.
            if (threadImagePath) {
                return PostModel.createAttachment(threadImageOriginalFilename, threadImagePath,
                    threadImageThumbnailPath, postId);
            } else {
                returnData.status = SUCCESS_STATUS;
                res.json(returnData); // send the success to the front end

                return Promise.reject(SKIP); // break out of the .then() promise chain early
            }
        })
        .then(attachmentId => { // we should only be here if an image was provided
            if (attachmentId === ERROR) throw new Error("Error with createAttachment().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData); // send the success to the front end
        })
        .catch((err) => {
            if (err === SKIP) return; // if the response has already been sent, do nothing

            returnData = { status: ERROR_STATUS };
            returnData.message = "An error occurred while creating your thread.";

            // delete the uploaded files on failed thread creation, if they exist
            if (threadImagePath) {
                fs.unlink(threadImagePath, () => { });
                fs.unlink(threadImageThumbnailPath, () => { });
            }

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
};

module.exports = createThread;