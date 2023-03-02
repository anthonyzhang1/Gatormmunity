/* This file contains the controller that deletes a group. */

const fs = require("fs");
const { ERROR, ERROR_STATUS, GROUP_ADMINISTRATOR_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Deletes a group from the database. The group's images are also deleted.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const deleteGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, userId } = req.body;

    GroupModel.getRole(userId, groupId) // check that the user is the admin of the group
        .then((role) => {
            if (role !== GROUP_ADMINISTRATOR_ROLE) throw new CustomError("Only group admins can delete their group.");

            return GroupModel.getGroupPicturePaths(groupId); // delete the group's pictures first
        })
        .then((picturePaths) => {
            if (picturePaths === ERROR) throw new Error("Error with getGroupPicturePaths().");

            // delete the group's picture and thumbnail
            fs.unlink(picturePaths.picture_path, () => { });
            fs.unlink(picturePaths.picture_thumbnail_path, () => { });
            return GroupModel.deleteGroup(groupId);
        })
        .then((deletedGroupId) => {
            if (deletedGroupId === ERROR) throw new Error("Error with deleteGroup().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the group due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = deleteGroup;