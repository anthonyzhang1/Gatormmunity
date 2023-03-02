/* This file contains the controller that creates a direct message. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const DirectMessageModel = require("../../models/DirectMessageModel");

/**
 * Inserts a direct message into the database.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createDirectMessage = (req, res) => {
    const { body, conversationId, senderId } = req.body;

    DirectMessageModel.createDirectMessage(body, senderId, conversationId) // insert the direct message into the database
        .then((directMessageId) => {
            if (directMessageId === ERROR) throw new Error("Error with createDirectMessage().");

            res.json({ status: SUCCESS_STATUS }); // tell the front end of the success
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS }; // stores the data sent to the front end
            returnData.message = "Your message was unable to be sent due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = createDirectMessage;