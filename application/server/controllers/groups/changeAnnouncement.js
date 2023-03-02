/* This file contains the controller that allows a user to change their group's anouncement. */

const { ERROR, ERROR_STATUS, GROUP_ADMINISTRATOR_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Changes a group's announcement. Only a group's admin can change their group's announcement.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const changeAnnouncement = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { announcement, groupId, userId } = req.body;

    GroupModel.getRole(userId, groupId) // verify that the person changing the announcement is the group's admin
        .then((role) => {
            if (role !== GROUP_ADMINISTRATOR_ROLE) {
                throw new CustomError("Only the group's admin can change the group's announcement.");
            }

            GroupModel.changeAnnouncement(groupId, announcement);
        })
        .then((affectedRows) => {
            if (affectedRows === ERROR) throw new Error("Error with changeAnnouncement().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "A server error occurred whilst changing your announcement.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
}

module.exports = changeAnnouncement;