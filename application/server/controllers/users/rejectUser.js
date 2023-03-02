/* This file contains the controller that rejects unapproved users. */

const fs = require("fs");
const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const UserModel = require("../../models/UserModel");

/**
 * Rejects an unapproved user by deleting the unapproved user. Only moderators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const rejectUser = (req, res) => {
    let returnData = {}; // stores what the back end will send to the front end
    const { userId } = req.body;

    UserModel.getUserPicturePaths(userId) // Delete the uploaded SFSU ID picture first before deleting the user
        .then((picturePaths) => {
            if (picturePaths === ERROR) throw new Error("Error with getUserPicturePaths().");

            fs.unlink(picturePaths.sfsu_id_picture_path, () => { });
            return UserModel.deleteUser(userId); // actually delete the user
        })
        .then((deletedUserId) => {
            if (deletedUserId === ERROR) throw new Error("Error with deleteUser().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = `An error occurred rejecting the user with id '${userId}'.`;

            console.log(err);
            res.json(returnData);
        });
};

module.exports = rejectUser;