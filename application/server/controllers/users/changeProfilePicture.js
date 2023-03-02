/* This file contains the controller that changes a user's profile picture. */

const path = require("path");
const fs = require("fs");
const createThumbnail = require("../../helpers/CreateThumbnail");
const UserModel = require("../../models/UserModel");
const { DEFAULT_PHOTO_PATH, ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");

/**
 * Changes a user's profile picture and their thumbnail. We delete the old pictures, if they are not the default photo.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const changeProfilePicture = (req, res) => {
    /** The width of the thumbnail to be created, in pixels. */
    const THUMBNAIL_WIDTH = 60;
    /** The height of the thumbnail to be created, in pixels. */
    const THUMBNAIL_HEIGHT = 60;

    const { userId } = req.body;
    const newPicturePath = req.file.path;
    const newPictureThumbnailPath = path.join(req.file.destination, `/tn-${req.file.filename}`);

    let returnData = {}; // the data that will be sent to the front end

    createThumbnail(req.file, newPicturePath, newPictureThumbnailPath, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
        .then(() => {
            // after creating the thumbnail, get the old profile picture paths so we can delete them
            return UserModel.getUserPicturePaths(userId);
        })
        .then((oldPictures) => {
            if (oldPictures === ERROR) throw new Error("Error with getUserPicturePaths().");

            // delete the user's old picture and thumbnail, unless it was the default photo
            if (oldPictures.profile_picture_path !== DEFAULT_PHOTO_PATH) {
                fs.unlink(oldPictures.profile_picture_path, () => { });
                fs.unlink(oldPictures.profile_picture_thumbnail_path, () => { });
            }

            // after deleting the old photos, update the user's image paths in the database
            return UserModel.updateProfilePicture(userId, newPicturePath, newPictureThumbnailPath);
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with updateProfilePicture().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "The server failed to change your profile picture.";

            // delete uploaded files on failed profile picture change
            fs.unlink(newPicturePath, () => { });
            fs.unlink(newPictureThumbnailPath, () => { });

            console.log(err);
            res.json(returnData);
        });
};

module.exports = changeProfilePicture;