/* This file contains the controller that demotes a group moderator to a group member. */

const { ERROR, ERROR_STATUS, GROUP_MEMBER_ROLE, GROUP_MODERATOR_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Demotes a group moderator to a group member. Only group admins can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * message: {string} A success message that should be shown to the user.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const demoteModerator = (req, res) => {
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what will be sent to the front end

    GroupModel.getRole(targetUserId, groupId) // make sure the target user is a group moderator
        .then((targetRole) => {
            if (targetRole !== GROUP_MODERATOR_ROLE) {
                throw new CustomError("You can only demote group moderators to group members.");
            }

            return GroupModel.setRole(groupId, targetUserId, GROUP_MEMBER_ROLE); // set group mod to group member
        })
        .then((affectedRows) => {
            if (affectedRows === ERROR) throw new Error("Error with setRole().");

            returnData.status = SUCCESS_STATUS;
            returnData.message = `${targetName} has been demoted to a group member.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred demoting the group moderator.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = demoteModerator;