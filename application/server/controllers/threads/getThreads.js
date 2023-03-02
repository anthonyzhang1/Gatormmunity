/* This file contains the controller that gets the most recently created threads in the forums pages. */

const { ERROR, SUCCESS_STATUS, SKIP, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require('../../models/GroupModel');
const ThreadModel = require('../../models/ThreadModel');

/**
 * Gets the recently created threads that are of the specified category, with the limit being defined in the controller.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * groupRole: {int} The role of the user in the group. If viewing the Gatormmunity Forums, this value will be 1,
 * threads: {Array} Contains objects containing threads and their data,
 * groupName: {string} The name of the group. This value is only sent for group forums.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getThreads = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_THREADS = 250; // return a maximum of this many threads
    const { category, sortBy, groupId, userId } = req.body;

    GroupModel.getRole(userId, groupId) // make sure the user is a member of the group, if applicable
        .then((groupRole) => {
            if (groupRole === ERROR) throw new CustomError("You are not a member of this group.");

            returnData.groupRole = groupRole; // 1 if groupId is null
            // get the threads of the specified category, without regard to thread title
            return ThreadModel.searchThreads(groupId, null, category, sortBy, MAX_MATCHED_THREADS);
        })
        .then((threads) => {
            if (!threads) throw new Error("Error with searchGatorThreads().");

            returnData.threads = threads; // these threads are ready to be sent back, regardless of Gatormmunity or Group Forums

            if (groupId) return GroupModel.getGroupName(groupId); // if we are getting a group's threads, get the group's name

            // if we are getting Gatormmunity Forum threads, we can send the data back now
            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
            return Promise.reject(SKIP); // break out of the .then() promise chain early
        })
        .then((groupName) => { // we are only here if we are getting a group's threads
            if (groupName === ERROR) throw new Error("Error with getGroupName().");

            returnData.status = SUCCESS_STATUS;
            returnData.groupName = groupName;
            res.json(returnData);
        })
        .catch((err) => {
            if (err === SKIP) return; // if returnData has already been sent, do nothing

            returnData = { status: ERROR_STATUS }; // clear out the old returnData values
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get the threads due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getThreads;