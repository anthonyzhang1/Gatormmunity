/* This file contains the controller that creates a group. */

const path = require("path");
const fs = require("fs");
const { ERROR, ERROR_STATUS, GROUP_ADMINISTRATOR_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const createThumbnail = require("../../helpers/CreateThumbnail");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");
const UserModel = require("../../models/UserModel");

/**
 * Inserts a group into the database. The thumbnail is also created here.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groupId: {int} The id of the newly created group.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createGroup = (req, res) => {
    /** The width of the thumbnail to be created, in pixels. */
    const THUMBNAIL_WIDTH = 60;
    /** The height of the thumbnail to be created, in pixels. */
    const THUMBNAIL_HEIGHT = 60;

    const { groupName, groupDescription, adminId } = req.body;
    const groupPicturePath = req.file.path;
    const groupPictureThumbnailPath = path.join(req.file.destination, `tn-${req.file.filename}`);

    let returnData = {}; // holds the data that will be sent to the front end

    createThumbnail(req.file, groupPicturePath, groupPictureThumbnailPath, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
        .then(() => {
            // if the thumbnail was successfully created, check if the user exists before making the group
            return UserModel.userExists(adminId);
        })
        .then((userExists) => {
            if (!userExists) throw new CustomError("Your user id is invalid. Please log out and try again.");

            return GroupModel.groupNameExists(groupName);
        })
        .then((groupNameExists) => {
            if (groupNameExists) throw new CustomError(`The group name "${groupName}" is already in use.`);

            return GroupModel.createGroup(groupName, groupDescription, groupPicturePath, groupPictureThumbnailPath);
        })
        .then((returnedGroupId) => {
            if (returnedGroupId === ERROR) throw new Error("Error with createGroup().");

            // After creating the group, assign the user who created the group as the group's admin
            returnData.groupId = returnedGroupId;
            return GroupModel.addGroupUser(returnedGroupId, adminId, GROUP_ADMINISTRATOR_ROLE);
        })
        .then((userId) => {
            if (userId === ERROR) throw new Error("Error with addGroupUser().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: ERROR_STATUS };

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred while creating your group.";

            // delete the uploaded files on failed group creation
            fs.unlink(groupPicturePath, () => { });
            fs.unlink(groupPictureThumbnailPath, () => { });

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = createGroup;