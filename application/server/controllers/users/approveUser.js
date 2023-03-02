/* This file contains the controller that approves unapproved users. */

const { APPROVED_USER_ROLE, ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const UserModel = require("../../models/UserModel");

/**
 * Makes an unapproved user an approved user. Only moderators can do this.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const approveUser = (req, res) => {
    let returnData = {}; // stores what the back end will send to the front end
    const { userId } = req.body;

    UserModel.setRole(userId, APPROVED_USER_ROLE) // sets the user as an approved user
        .then((returnedUserId) => {
            if (returnedUserId === ERROR) throw new Error("Error with setRole().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = `An error occurred approving the user with id '${userId}'.`;

            console.log(err);
            res.json(returnData);
        });
};

module.exports = approveUser;