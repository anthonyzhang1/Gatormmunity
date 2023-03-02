/* This file contains the controller that gets the search results when the user searches for users. */

const { SUCCESS_STATUS, SKIP, ERROR_STATUS } = require("../../helpers/Constants");
const UserModel = require("../../models/UserModel");

/**
 * Performs the user search operation and sends back a list of users. The returned users will either be those
 * that match the search terms, or those that were selected as a suggestion due to no users matching the search terms.
 *
 * Response on Success:
 * If the search matched users:
 *     status: {string} SUCCESS_STATUS,
 *     numUsersMatched: {int} The number of users sent back,
 *     users: {Array} Contains objects containing users and their data.
 * 
 * If the search did not match any users:
 *     status: {string} SUCCESS_STATUS,
 *     numUsersMatched: {int} 0, since no users were matched,
 *     users: {Array} Contains objects containing suggested users and their data.
 * 
 * Response on Failure:
 *     status: {string} ERROR_STATUS,
 *     message: {string} An error message that should be shown to the user.
 */
const search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_RETURNED_USERS = 250; // return a maximum of this many users
    const NUM_RECOMMENDED_SEARCH_RESULTS = 10; // return this many users if no matches were found
    const { searchTerms, role } = req.body;

    UserModel.searchUsers(searchTerms, role, MAX_RETURNED_USERS) // search for users with the provided parameters
        .then((matchedUsers) => {
            // if no matches were found with the provided search terms, display some recommendations
            if (matchedUsers.length === 0) return UserModel.getNRecommendedUsers(NUM_RECOMMENDED_SEARCH_RESULTS);

            // if users were matched, send them to the front end
            returnData.status = SUCCESS_STATUS;
            returnData.numUsersMatched = matchedUsers.length;
            returnData.users = matchedUsers;
            res.json(returnData);

            return Promise.reject(SKIP); // break out of the .then() promise chain early
        })
        .then((recommendedUsers) => {
            returnData.status = SUCCESS_STATUS;
            returnData.numUsersMatched = 0; // no matched users
            returnData.users = recommendedUsers;

            res.json(returnData);
        })
        .catch((err) => {
            if (err === SKIP) return; // if returnData has already been sent, do nothing

            returnData.status = ERROR_STATUS;
            returnData.message = "An error occurred while performing your search.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = search;