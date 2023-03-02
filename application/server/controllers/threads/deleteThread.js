/* This file contains the controller that deletes forum threads and its image. */

const fs = require("fs");
const { SUCCESS_STATUS, ERROR_STATUS, ERROR } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const ThreadModel = require('../../models/ThreadModel');

/**
 * Delete a thread and its images.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const deleteThread = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { threadId } = req.body;

    ThreadModel.getThreadPicturePaths(threadId) // get the paths of the pictures for deletion
        .then((picturePaths) => {
            if (picturePaths === ERROR) throw new Error("Error with getThreadPicturePaths().");

            // delete the thread's picture and thumbnail, if it exists
            if (picturePaths) {
                fs.unlink(picturePaths.image_path, () => { });
                fs.unlink(picturePaths.thumbnail_path, () => { });
            }

            return ThreadModel.deleteThread(threadId); // now we can safely delete the thread
        })
        .then((deletedThreadId) => {
            if (deletedThreadId === ERROR) throw new Error("Error with deleteThread().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the thread due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = deleteThread;