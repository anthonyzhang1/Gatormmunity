/* This file contains the controller that gets all of the groups a user is in. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const GroupModel = require("../../models/GroupModel");

/**
 * Gets all the groups the user is in, in ascending alphabetical order.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groups: {Array} Contains objects containing groups and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getUsersGroups = (req, res) => {
    let returnData = {};
    const { userId } = req.params;

    GroupModel.getUsersGroups(userId)
        .then((groups) => {
            if (groups === ERROR) throw new Error("Error with getUsersGroups().");

            returnData.status = SUCCESS_STATUS;
            returnData.groups = groups;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "A server error occurred trying to get your groups.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getUsersGroups;