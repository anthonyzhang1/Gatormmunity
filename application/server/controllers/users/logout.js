/* This file contains the controller that logs the user out by deleting their session data. */

const { ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");

/**
 * Logs the user out by destroying their session and clearing their session cookie.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS.
 */
const logout = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    // destroy the user's session
    req.session.destroy((err) => {
        if (err) { // If the logout failed, let the front end know
            console.log(err);

            returnData.status = ERROR_STATUS;
            res.json(returnData); // send back the error
            return;
        }

        res.clearCookie("session_id");
        returnData.status = SUCCESS_STATUS;
        res.json(returnData); // send back the success
    });
};

module.exports = logout;