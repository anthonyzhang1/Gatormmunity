/* This file contains the controller that allows group users and moderators to leave a group. */

const { ERROR, GROUP_ADMINISTRATOR_ROLE, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Lets group members or group moderators leave their group. Group admins cannot leave their group.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const leaveGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, userId } = req.body;

    GroupModel.getRole(userId, groupId) // check that the user is a member of the group and not its admin
        .then((role) => {
            if (role === ERROR) {
                throw new CustomError("You cannot leave a group you are not a member of.");
            } else if (role === GROUP_ADMINISTRATOR_ROLE) {
                throw new CustomError("You cannot leave your group because you are its administrator.");
            }

            return GroupModel.deleteGroupUser(groupId, userId); // leave the group
        })
        .then((groupId) => {
            if (groupId === ERROR) throw new Error("Error with deleteGroupUser().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "You were unable to leave the group due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
}

module.exports = leaveGroup;