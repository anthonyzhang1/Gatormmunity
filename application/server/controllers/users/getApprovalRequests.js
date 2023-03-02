/* This file contains the controller that gets the approval requests, i.e. the list of unapproved users. */

const { SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const UserModel = require("../../models/UserModel");

/**
 * Gets the list of unapproved users for a moderator to approve or reject.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * unapprovedUsers: {Array} Contains objects containing unapproved users and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getApprovalRequests = (_, res) => {
    let returnData = {}; // stores what the back end will send to the front end

    UserModel.getUnapprovedUsers()
        .then((unapprovedUsers) => {
            if (!unapprovedUsers) throw new Error("An error occured with getUnapprovedUsers().");

            returnData.status = SUCCESS_STATUS;
            returnData.unapprovedUsers = unapprovedUsers;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "An error occurred getting the approval requests.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getApprovalRequests;