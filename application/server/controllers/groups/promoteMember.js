/* This file contains the controller that allows group administrators to promote group members to group moderators. */

const { GROUP_MEMBER_ROLE, GROUP_MODERATOR_ROLE, ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Promotes a group member to a group moderator. Only group admins can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const promoteMember = (req, res) => {
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    GroupModel.getRole(targetUserId, groupId) // make sure the target user is a group member
        .then((targetRole) => {
            if (targetRole !== GROUP_MEMBER_ROLE) {
                throw new CustomError("You can only promote group members to group moderators.");
            }

            return GroupModel.setRole(groupId, targetUserId, GROUP_MODERATOR_ROLE); // make the group member a group mod
        })
        .then((affectedRows) => {
            if (affectedRows === ERROR) throw new Error("Error with setRole().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `${targetName} has been promoted to a group moderator.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred promoting the group member.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = promoteMember;