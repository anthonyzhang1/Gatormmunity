/* This file contains the controller that gets the data for a group's home page. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require("../../models/GroupModel");

/**
 * Gets the data needed to display a group's home page.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * group: {Object} Contains the group's home page data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getGroupHome = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel.getRole(userId, groupId) // check that the user is a member of the group
        .then((role) => {
            if (role === ERROR) throw new CustomError("You are not a member of this group.");

            return GroupModel.getGroupHomeData(groupId);
        })
        .then((groupData) => {
            if (groupData === ERROR) throw new CustomError(`There is no group with id '${groupId}'.`);

            returnData.status = SUCCESS_STATUS;
            returnData.group = groupData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get this group's home page. Please try again.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getGroupHome;