/* This file contains the controller that allows users to join groups if the correct join code was entered. */

const { ERROR, ERROR_STATUS, GROUP_MEMBER_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Attempt to join a group. A user can join a group if both the group id and join code are correct.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const joinGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, joinCode: providedJoinCode, userId } = req.body;

    GroupModel.getRole(userId, groupId) // check if the user is already a member of the group
        .then((role) => {
            if (role !== ERROR) throw new CustomError("You are already a member of this group.");

            return GroupModel.getJoinCode(groupId); // get the group's actual join code
        })
        .then((joinCode) => {
            if (providedJoinCode !== joinCode) throw new CustomError("Invalid join code.");

            return GroupModel.addGroupUser(groupId, userId, GROUP_MEMBER_ROLE); // join the group as a group member
        })
        .then((returnedUserId) => {
            if (returnedUserId === ERROR) throw new Error("Error with addGroupUser().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "You were unable to join the group due to a server error. Please try again.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = joinGroup;