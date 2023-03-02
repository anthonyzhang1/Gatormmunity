const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const transporter = require("../config/nodemailerConfig");
const UserModel = require("../models/UserModel");
const AccountModel = require("../models/AccountModel");
const CustomError = require("../helpers/CustomError");

/**
 * Attempt to create the user's account in the database. The server validates the input first via the
 * `registrationValidator` middleware. The user's pictures are saved on the server if the registration was successful.
 *
 * The back end sends:
 * If the registration succeeded:
 *     status: "success".
 * If the registration failed:
 *     status: "error",
 *     message: String containing an error message that should be displayed to the user.
 */
exports.user_register = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const full_name = req.body.full_name;
    const email = req.body.email;
    const sfsu_id_number = req.body.sfsu_id_number;
    const plaintextPassword = req.body.password;
    const role = 1; // for M3, we're not approving anyone
    const sfsu_id_picture_path = req.files["sfsu_id_picture"][0].path;

    const profile_picture_path = path.join("/", "public", "profile_pictures", "defaultPhoto.png");
    const profile_picture_thumbnail_path = path.join("/", "public", "profile_picture_thumbnails", "defaultPhoto.png");
    let user_id = ""; // used to tell the account what its associated user_id is

    /** This function removes any extra whitespace in the name and returns the first and last name in the name in the format:
      * [first_name, last_name]. */
    const getFirstLastName = (full_name) => {
        const nameArray = full_name.trim().split(/\s+/);

        return [nameArray[0], nameArray.slice(1).join(" ")];
    }

    UserModel.emailExists(email)
        .then((emailExists) => {
            if (emailExists) {
                throw new CustomError(`The email ${email} is already in use.`);
            }
            return UserModel.sfsuIdNumberExists(sfsu_id_number);
        })
        .then((sfsuIdNumberExists) => {
            if (sfsuIdNumberExists) {
                throw new CustomError(`The SFSU ID number ${sfsu_id_number} is already in use.`);
            }

            // get the first and last name from the full name and assign them to the relevant variables
            const [first_name, last_name] = getFirstLastName(full_name);

            return UserModel.addNewUser(
                first_name,
                last_name,
                email,
                sfsu_id_number,
                sfsu_id_picture_path,
                profile_picture_path,
                profile_picture_thumbnail_path,
                role
            );
        })
        .then((returnedUserId) => {
            if (returnedUserId < 0) {
                throw new Error("Error with addNewUser().");
            }

            user_id = returnedUserId; // save the user's user_id for later
            return AccountModel.addNewAccount(plaintextPassword, user_id); // Add the new account to the database
        })
        .then((account_id) => {
            if (account_id < 0) {
                throw new Error("Error with addNewAccount().");
            }

            returnData.status = "success";
            res.json(returnData); // let the front end know the back end successfully created the user and account
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) {
                returnData.message = err.message;
            } else {
                returnData.message = "Your registration failed due to a server error.";
            }

            // delete uploaded files on failed registration
            fs.unlink(sfsu_id_picture_path, () => { });

            console.log(err);
            res.json(returnData); // let the front end know the back end failed to create the user or account
        });
};

/**
 * Attempt to log the user in by checking the entered credentials versus the credentials in the database.
 * The user will have a session created for them if the login was successful.
 * 
 * The back end sends:
 * If the login succeeded:
 *     status: "success".
 * If the login failed:
 *     status: "error",
 *     message: String containing an error message that should be displayed to the user.
 */
exports.user_login = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const sfsu_id_number = req.body.sfsu_id_number;
    const plaintextPassword = req.body.password;

    // Check if the user's provided sfsu_id_number and password are correct
    AccountModel.authenticate(sfsu_id_number, plaintextPassword)
        .then((userData) => {
            // if the login credentials were invalid, show the user an error
            if (userData === -1) {
                throw new CustomError("Incorrect SFSU ID number and/or password.");
            }

            // the attributes we are saving in the user session object
            req.session.userSessionData = {
                user_id: userData.user_id,
                first_name: userData.first_name,
                last_name: userData.last_name,
                profile_picture_path: userData.profile_picture_path,
                profile_picture_thumbnail_path: userData.profile_picture_thumbnail_path,
                join_date: userData.join_date,
                role: userData.role,
            };

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // Use our custom error message if the error is one we accounted for, and use a generic error message
            // if the error is not one we acccounted for, so we do not show the user an error message they won't understand
            if (err instanceof CustomError) {
                returnData.message = err.message;
            } else {
                returnData.message = "Your login failed due to a server error.";
            }

            console.log(err);
            res.json(returnData); // tell the front end that the login failed
        });
};

/*
 * Tells the front end whether the user is logged in or not.
 *
 * The back end sends:
 * If the user is logged in:
 *     status: "success",
 *     userSessionData: Object containing the user's session data saved in the `users/login` route.
 * If the user is not logged in:
 *     status: "success",
 *     userSessionData: `null`.
 */
exports.user_authenticate = (req, res) => {
    let returnData = { status: "succcess" }; // holds the data that will be sent to the front end

    // the existence of req.session.userSessionData implies that the user is logged in
    if (req.session.userSessionData) {
        returnData.userSessionData = req.session.userSessionData;
    } else {
        returnData.userSessionData = null;
    }

    res.json(returnData);
};

/*
 * Logs the user out by destroying their session and clearing their session cookie.
 *
 * The back end sends:
 * If the logout succeeded:
 *     status: "success".
 * If the logout failed:
 *     status: "error".
 */
exports.user_logout = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    // destroy the user's session on the back end
    req.session.destroy((err) => {
        // If the logout failed, let the front end know
        if (err) {
            console.log(err);

            returnData.status = "error";
            res.json(returnData); // send back the error
        }

        res.clearCookie("session_id");

        returnData.status = "success";
        res.json(returnData); // send back the success
    });
};

/*
 * Performs the user search operation and sends back a list of users. The returned users will either be those
 * that match the search terms, or those that were selected as a suggestion due to no users matching the search terms.
 *
 * The back end sends:
 * If the search matched users:
 *     status: "success",
 *     numUsersMatched: int containing how many users are being sent back,
 *     users: Object containing the matched users and their attributes that will be shown to the user.
 * If the search did not match any users:
 *     status: "success",
 *     numUsersMatched: 0, since no users were matched,
 *     users: Object containing the suggested users and their attributes that will be shown to the user.
 * If the search encountered an error:
 *     status: "error",
 *     message: String containing an error message that shouldbe shown to the user.
 */
exports.user_search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_RETURNED_USERS = 250; // return a maximum of this many users
    const NUM_RECOMMENDED_SEARCH_RESULTS = 10; // return this many users if no matches were found
    const searchTerms = req.body.searchTerms;
    const role = req.body.role;

    // search for users with the provided parameters in the database
    UserModel.searchUsers(searchTerms, role, MAX_RETURNED_USERS)
        .then((matchedUsers) => {
            // if no matches were found with the provided search terms,
            // query the database for a few of the most recently created users instead
            if (matchedUsers.length === 0) {
                return UserModel.getNRecommendedUsers(NUM_RECOMMENDED_SEARCH_RESULTS);
            }

            // if users were matched, send them to the front end
            returnData.status = "success";
            returnData.numUsersMatched = matchedUsers.length;
            returnData.users = matchedUsers;

            res.json(returnData);
            return Promise.reject("SKIP"); // break out of the .then() promise chain early
        })
        .then((recommendedUsers) => {
            returnData.status = "success";
            returnData.numUsersMatched = 0; // no matched users
            returnData.users = recommendedUsers;

            res.json(returnData);
        })
        .catch((err) => {
            // if returnData has already been sent, do nothing
            if (err === "SKIP") return;

            returnData.status = "error";
            returnData.message = "An error occurred while performing your search.";

            console.log(err);
            res.json(returnData); // tell the front end that the search failed
        });
};

exports.user_contact_us = (req, res) => {
    const senderName = req.body.senderName;
    const senderEmail = req.body.senderEmail;
    const messageBody = req.body.messageBody;
    let emailSubject = ""; // use the email subject provided by the user, or use a default one if none is given

    if (req.body.messageSubject.length > 0) {
        // use the email subject provided by the user
        emailSubject = "[Contact Us] " + req.body.messageSubject;
    } else {
        // use the default email subject
        emailSubject = `[Contact Us] Message from ${senderName}`;
    }

    /** This is the configuration for the email being sent.
     * The html is the actual body of the message that will be displayed. */
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: process.env.NODEMAILER_USER,
        subject: emailSubject,
        html: `
			<h3>Sender's Information</h3>
			<p>Name: ${senderName}</p>
			<p>Email: ${senderEmail}</p>
			<h3>Message:</h3>
			<p>${messageBody}</p>
			`,
    };

    transporter.sendMail(mailOptions, (err) => {
        // tell the front end an error occurred if the email failed to send
        if (err) {
            console.log("Nodemailer failed to send an email:", err);
            res.json({ status: "error" });
            return;
        }

        // tell the front end if the email successfully sent
        res.json({ status: "success" });
    });
};

// TODO: Delete the old profile picture and thumbnail in M4, unless it was the default photo
exports.change_profile_picture = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const user_id = req.body.userId;
    const profile_picture_path = path.join('/', req.files["profilePicture"][0].path);
    const profile_picture_thumbnail_path = path.join("/", "public", "profile_picture_thumbnails",
        req.files["profilePicture"][0].filename);

    /**
    * Creates a thumbnail of the user's profile picture, if it exists. If it does not exist, this function does nothing.
    * @returns If the thumbnail was created, returns a resolved promise. On failure, returns a rejected promise.
    */
    function createProfilePictureThumbnail(profile_picture_file) {
        // checks if the profile picture file exists first before operating on it
        if (profile_picture_file) {
            return sharp(profile_picture_path.substring(1)) // get the path of the file to make a thumbnail of
                .resize(60, 60) // resize image to (width, height) pixels
                .toFile(profile_picture_thumbnail_path.substring(1)) // save thumbnail to `profile_picture_thumbnail_path`
                .catch((err) => Promise.reject(err)); // throw an error on error
        } else {
            return Promise.resolve(); // do nothing if the profile picture file does not exist
        }
    }

    createProfilePictureThumbnail(req.files["profilePicture"])
        .then(() => {
            // after creating the profile picture thumbnail, update the user's image paths in the database
            return UserModel.changeProfilePicture(user_id, profile_picture_path, profile_picture_thumbnail_path);
        })
        .then(userId => {
            if (userId < 0) {
                throw new Error("Error with changeProfilePicture().");
            }

            returnData.status = "success";
            res.json(returnData);
        })
        .catch(err => {
            returnData.status = "error";
            returnData.message = "The server failed to change your profile picture.";

            // delete uploaded files on failed profile picture change
            fs.unlink(profile_picture_path, () => { });
            fs.unlink(profile_picture_thumbnail_path, () => { });

            console.log(err);
            res.json(returnData);
        })
};