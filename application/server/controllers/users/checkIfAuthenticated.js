/* This file contains the controller that checks whether a user is logged in or banned,
 * and sends the session data to the front end. */

const { ERROR } = require("../../helpers/Constants");
const AccountModel = require("../../models/AccountModel");

/**
 * Tells the front end whether the user is logged in and sends back their session data if they are.
 * If the user is banned, the user will be forcefully logged out.
 *
 * Response on Success:
 * If the user is logged in:
 *     {Object} The user's session data.
 * 
 * If the user is not logged in or is banned:
 *     isLoggedIn: {boolean} false.
 * 
 * Response on Failure:
 * isLoggedIn: {boolean} false.
 */
const checkIfAuthenticated = (req, res) => {
    AccountModel.getUserSessionData(req.session.userData?.user_id) // gets the user's session data from the database
        .then((sessionData) => {
            if (sessionData === ERROR) { // the user is not logged in
                res.json({ isLoggedIn: false });
            } else if (sessionData.banned_by_id) { // if the user has been banned, log them out
                req.session.destroy(_ => {
                    res.clearCookie("session_id");
                    res.json({ isLoggedIn: false });
                });
            } else { // the user is logged in
                req.session.userData = { // updates the user's session data
                    isLoggedIn: true,
                    user_id: sessionData.user_id,
                    first_name: sessionData.first_name,
                    profile_picture_thumbnail_path: sessionData.profile_picture_thumbnail_path,
                    role: sessionData.role
                };

                res.json(req.session.userData); // send the user's session data to the front end
            }
        })
        .catch((err) => {
            // somehow there was an error with getting the user's session data; treat the user as if they were not logged in
            console.log(err);
            res.json({ isLoggedIn: false });
        });
};

module.exports = checkIfAuthenticated;