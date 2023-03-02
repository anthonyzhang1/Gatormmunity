/* This file contains the controller that gets a group's members. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Gets the members of a group and their group roles.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groupRole: {int} The group role of the user viewing the page.
 * groupName: {string} The name of the group.
 * users: {Array} Contains objects containing the group's users and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getMembers = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel.getRole(userId, groupId) // check that the user is a member of the group and save their role
        .then((selfGroupRole) => {
            if (selfGroupRole === ERROR) throw new CustomError("You are not a member of this group.");

            returnData.groupRole = selfGroupRole;
            return GroupModel.getGroupName(groupId);
        })
        .then((groupName) => {
            if (groupName === ERROR) throw new Error("Error with getGroupName().");

            returnData.groupName = groupName;
            return GroupModel.getGroupUsers(groupId); // get all of the group's members
        })
        .then((groupUsers) => {
            if (groupUsers === ERROR) throw new Error("Error with getGroupUsers().");

            returnData.status = SUCCESS_STATUS;
            returnData.users = groupUsers;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get this group's members. Please ensure the group's id is correct.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getMembers;