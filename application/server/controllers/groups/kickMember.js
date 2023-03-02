/* This file contains the controller that allows group moderators to kick group members out of a group. */

const { GROUP_MEMBER_ROLE, ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Kicks a group member out of a group. Only group mods and group admins can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const kickMember = (req, res) => {
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    GroupModel.getRole(targetUserId, groupId) // make sure the target user is a group member
        .then((targetRole) => {
            if (targetRole !== GROUP_MEMBER_ROLE) throw new CustomError("You can only kick group members from a group.");

            return GroupModel.deleteGroupUser(groupId, targetUserId); // kick the target user by deleting them from the group
        })
        .then((returnedGroupId) => {
            if (returnedGroupId === ERROR) throw new Error("Error with deleteGroupUser().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `${targetName} has been kicked from the group.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred whilst kicking the user from the group.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = kickMember;