/* This file contains the controller that gets a group's name. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Gets the name of the group.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groupName: {string} The name of the group.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getGroupName = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel.getRole(userId, groupId) // check that the user is a member of the group
        .then((role) => {
            if (role === ERROR) throw new CustomError("You are not a member of this group.");

            return GroupModel.getGroupName(groupId);
        })
        .then((groupName) => {
            if (groupName === ERROR) throw new CustomError(`There is no group with the id '${groupId}'.`);

            returnData.status = SUCCESS_STATUS;
            returnData.groupName = groupName;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get the group's name due to a server error.";

            console.log(err);
            res.json(returnData);
        });
}

module.exports = getGroupName;