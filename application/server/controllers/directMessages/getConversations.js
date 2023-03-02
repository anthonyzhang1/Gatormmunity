/* This file contains the controller that gets all the conversations a user is in. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const DirectMessageModel = require("../../models/DirectMessageModel");
const UserModel = require("../../models/UserModel");

/**
 * Gets a user's active conversations.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * conversations: {Array} Contains objects containing conversations and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getConversations = (req, res) => {
    let returnData = {}; // saves the data sent to the front end
    const { userId } = req.params;

    UserModel.userExists(userId) // check that the user exists first, just in case
        .then((userExists) => {
            if (!userExists) throw new CustomError(`There is no user with the id '${userId}'.`);

            return DirectMessageModel.getConversations(userId); // get the conversations the user is in
        })
        .then((conversationData) => {
            if (conversationData === ERROR) throw new Error("Error with getConversations().");

            returnData.status = SUCCESS_STATUS;
            returnData.conversations = conversationData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get your conversations due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getConversations;