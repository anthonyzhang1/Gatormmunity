const path = require("path");
const fs = require("fs");
const CustomError = require("../helpers/CustomError");
const createThumbnail = require("../helpers/CreateThumbnail");
const AccountModel = require("../models/AccountModel");
const ListingModel = require("../models/ListingModel");
const PostModel = require("../models/PostModel");
const ThreadModel = require("../models/ThreadModel");
const UserModel = require("../models/UserModel");

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
exports.register = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { full_name, email, sfsu_id_number, password: plaintextPassword } = req.body;

    const sfsu_id_picture_path = req.file.path;

    const profile_picture_path = path.join("public", "profile_pictures", "defaultPhoto.png");
    const profile_picture_thumbnail_path = path.join("public", "profile_pictures", "tn-defaultPhoto.png");
    let user_id = ""; // used to tell the account what its associated user_id is

    /** This function removes any extra whitespace in the name and returns the first and last name in the name in the format:
     * [first_name, last_name]. */
    const getFirstLastName = (full_name) => {
        const nameArray = full_name.trim().split(/\s+/);

        return [nameArray[0], nameArray.slice(1).join(" ")];
    };

    UserModel.emailExists(email)
        .then((emailExists) => {
            if (emailExists) throw new CustomError(`The email ${email} is already in use.`);

            return UserModel.sfsuIdNumberExists(sfsu_id_number);
        })
        .then((sfsuIdNumberExists) => {
            if (sfsuIdNumberExists) throw new CustomError(`The SFSU ID number ${sfsu_id_number} is already in use.`);

            // get the first and last name from the full name and assign them to the relevant variables
            const [first_name, last_name] = getFirstLastName(full_name);

            return UserModel.createUser(first_name, last_name, email, sfsu_id_number, sfsu_id_picture_path,
                profile_picture_path, profile_picture_thumbnail_path);
        })
        .then((returnedUserId) => {
            if (returnedUserId < 0) throw new Error("Error with createUser().");

            user_id = returnedUserId; // save the user's user_id for later
            return AccountModel.createAccount(plaintextPassword, user_id); // Add the new account to the database
        })
        .then((account_id) => {
            if (account_id < 0) throw new Error("Error with createAccount().");

            returnData.status = "success";
            res.json(returnData); // let the front end know the back end successfully created the user and account
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your registration failed due to a server error.";

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
 *     status: {string} "success".
 * If the login failed:
 *     status: {string} "error",
 *     message: {string} An error message that should be displayed to the user.
 */
exports.login = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { sfsu_id_number, password: plaintextPassword } = req.body;

    AccountModel
        .authenticateUser(sfsu_id_number, plaintextPassword) // Check if the provided sfsu_id_number and password are correct
        .then((userData) => {
            if (userData === -1) { // if the login credentials were invalid
                throw new CustomError("Incorrect SFSU ID number and/or password.");
            } else if (userData.role < 1) { // if user is unapproved
                throw new CustomError("Your account is still awaiting approval. Please try logging in again later.");
            } else if (userData.banned_by_id) { // if the user is banned
                throw new CustomError("Sorry, but your account has been banned. " +
                    "If you believe this ban has been made in error, please contact us.");
            }

            // sets the user's session data
            req.session.userData = {
                isLoggedIn: true,
                user_id: userData.user_id,
                first_name: userData.first_name,
                profile_picture_thumbnail_path: userData.profile_picture_thumbnail_path,
                role: userData.role
            };

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // if the error is not one we acccounted for, so we do not show the user an error message they won't understand
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your login failed due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end that the login failed
        });
};

/*
 * Tells the front end whether the user is logged in or not.
 *
 * The back end sends:
 * If the user is logged in:
 *     userSessionData: {Object} The user's session data.
 * If the user is not logged in:
 *     userSessionData: {Object} isLoggedIn: false.
 */
exports.checkIfAuthenticated = (req, res) => {
    AccountModel
        .getUserSessionData(req.session.userData?.user_id)
        .then((sessionData) => {
            if (sessionData === -1) res.json({ isLoggedIn: false }); // means the user is not logged in
            else {
                // updates the user's session data
                req.session.userData = {
                    isLoggedIn: true,
                    user_id: sessionData.user_id,
                    first_name: sessionData.first_name,
                    profile_picture_thumbnail_path: sessionData.profile_picture_thumbnail_path,
                    role: sessionData.role
                };

                res.json(req.session.userData);
            }
        })
        .catch(err => {
            console.log(err);
            res.json({ isLoggedIn: false }); // somehow there was an error with getting the user's session data
        })
};

exports.getDashboard = (req, res) => {
    /** The maximum number of rows to get data from in the database. */
    const NUM_ROWS_RETURNED = 10;
    const { userId } = req.params; // the id of the user that we are getting the picture of
    let returnData = {}; // holds the data that will be sent to the front end
    
    UserModel
        .getUserPicturePaths(userId) // get the user's profile picture
        .then((picturePaths) => {
            if (picturePaths === -1) throw new Error("Error with getUserPicturePaths().");

            returnData.profile_picture_path = picturePaths.profile_picture_path
            return ThreadModel.getNRecentIdsAndTitles(NUM_ROWS_RETURNED);
        })
        .then((threads) => {
            if (threads === -1) throw new Error("Error with getNRecentIdsAndTitles().");

            returnData.threads = threads;
            return ListingModel.getNRecentListingIdTitlePrice(NUM_ROWS_RETURNED);
        })
        .then((listings) => {
            if (listings === -1) throw new Error("Error with getNRecentListingIdTitlePrice().");

            returnData.status = "success";
            returnData.listings = listings;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: "error" }; // empty out returnData in case it already contained data from .then
            returnData.message = "An error occurred while getting your dashboard's data.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
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
exports.logout = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    // destroy the user's session on the back end
    req.session.destroy((err) => {
        // If the logout failed, let the front end know
        if (err) {
            console.log(err);

            returnData.status = "error";
            res.json(returnData); // send back the error
            return;
        }

        res.clearCookie("session_id");
        returnData.status = "success";
        res.json(returnData); // send back the success
    });
};

/**
 * Performs the user search operation and sends back a list of users. The returned users will either be those
 * that match the search terms, or those that were selected as a suggestion due to no users matching the search terms.
 *
 * The back end sends:
 * If the search matched users:
 *     status: {string} "success",
 *     numUsersMatched: {int} The number of users sent back,
 *     users: {Object} Contains the matched users and their attributes.
 * If the search did not match any users:
 *     status: {string} "success",
 *     numUsersMatched: {int} 0, since no users were matched,
 *     users: {Object} Contains the suggested users and their attributes.
 * If the search encountered an error:
 *     status: {string} "error",
 *     message: {string} The error message to show the user.
 */
exports.search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_RETURNED_USERS = 250; // return a maximum of this many users
    const NUM_RECOMMENDED_SEARCH_RESULTS = 10; // return this many users if no matches were found
    const { searchTerms, role } = req.body;

    // search for users with the provided parameters in the database
    UserModel.searchUsers(searchTerms, role, MAX_RETURNED_USERS)
        .then((matchedUsers) => {
            // if no matches were found with the provided search terms,
            // query the database for a few of the most recently created users instead
            if (matchedUsers.length === 0) return UserModel.getNRecommendedUsers(NUM_RECOMMENDED_SEARCH_RESULTS);

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
            res.json(returnData);
        });
};

exports.changeProfilePicture = (req, res) => {
    /** The path of the default photo that we use. We do not want to delete this one! */
    const DEFAULT_PHOTO_PATH = path.join("public", "profile_pictures", "defaultPhoto.png");

    let returnData = {}; // the data that will be sent to the front end
    const { userId } = req.body;
    const new_picture_path = req.file.path;
    const new_picture_thumbnail_path = path.join(req.file.destination, `/tn-${req.file.filename}`);

    createThumbnail(req.file, new_picture_path, new_picture_thumbnail_path, 60, 60)
        .then(() => {
            // after creating the thumbnail, get the old profile picture paths so we can delete them
            return UserModel.getUserPicturePaths(userId);
        })
        .then((oldPictures) => {
            if (oldPictures === -1) throw new Error("Error with getUserPicturePaths().");

            // delete the user's old picture and thumbnail, unless it was the default photo
            if (oldPictures.profile_picture_path !== DEFAULT_PHOTO_PATH) {
                fs.unlink(oldPictures.profile_picture_path, () => { });
                fs.unlink(oldPictures.profile_picture_thumbnail_path, () => { });
            }

            // after deleting the old photos, update the user's image paths in the database
            return UserModel.updateProfilePicture(userId, new_picture_path, new_picture_thumbnail_path);
        })
        .then((userId) => {
            if (userId < 0) throw new Error("Error with changeProfilePicture().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "The server failed to change your profile picture.";

            // delete uploaded files on failed profile picture change
            fs.unlink(new_picture_path, () => { });
            fs.unlink(new_picture_thumbnail_path, () => { });

            console.log(err);
            res.json(returnData);
        });
};

exports.getProfile = (req, res) => {
    /** The maximum number of activities to return to the user. */
    const NUM_ACTIVITIES_SHOWN = 15;
    const { userId } = req.params; // the id of the user that we are getting the profile of

    let returnData = {}; // stores what the back end will send to the front end
    let recentActivities = []; // stores the user's recent activities

    UserModel
        .getUserProfileData(userId)
        .then((profileData) => {
            if (profileData === -1) throw new CustomError(`The user with id '${userId}' was not found.`);

            returnData.user = profileData;
            return ThreadModel.getUserNGatorThreadTitles(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((threads) => {
            if (threads === -1) throw new Error("An error occured with getUserNGatorThreadTitles().");

            recentActivities.push(...threads);
            return PostModel.getUserNGatorReplyPostThreadTitles(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((threads) => {
            if (threads === -1) throw new Error("An error occured with getUserNGatorReplyPostThreadTitles().");

            recentActivities.push(...threads);
            return ListingModel.getUserNRecentListingTitles(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((listings) => {
            if (listings === -1) throw new Error("An error occured with getUserNRecentListingTitles().");

            recentActivities.push(...listings);

            // Sort the activites by creation date, in descending order. Newest activities first.
            recentActivities.sort((a, b) => {
                if (a.creation_date > b.creation_date) return -1;
                else if (a.creation_date < b.creation_date) return 1;
                else return 0;
            });

            returnData.status = "success";
            returnData.recentActivities = recentActivities.slice(0, NUM_ACTIVITIES_SHOWN);
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: "error" };

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to display this user's profile. Please try again.";

            console.log(err);
            res.json(returnData);
        });
};

exports.getApprovalRequests = (_, res) => {
    let returnData = {}; // stores what the back end will send to the front end

    UserModel
        .getUnapprovedUsers()
        .then((unapprovedUsers) => {
            if (!unapprovedUsers) throw new Error("An error occured with getUnapprovedUsers().");

            returnData.status = "success";
            returnData.unapprovedUsers = unapprovedUsers;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "An error occurred getting the approval requests.";

            console.log(err);
            res.json(returnData);
        })
};

exports.approveUser = (req, res) => {
    let returnData = {}; // stores what the back end will send to the front end
    const { userId } = req.body;

    UserModel
        .setRole(userId, 1)
        .then((returnedUserId) => {
            if (returnedUserId === -1) throw new Error("Error with setRole().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = `An error occurred approving the user with id '${userId}'.`;

            console.log(err);
            res.json(returnData);
        });
};

exports.rejectUser = (req, res) => {
    let returnData = {}; // stores what the back end will send to the front end
    const { userId } = req.body;

    // Delete the uploaded sfsu id picture first before deleting the user
    UserModel
        .getUserPicturePaths(userId)
        .then((picturePaths) => {
            if (picturePaths === -1) throw new Error("Error with getUserPicturePaths().");

            fs.unlink(picturePaths.sfsu_id_picture_path, () => { });
            return UserModel.deleteUser(userId); // actually delete the user
        })
        .then((deletedUserId) => {
            if (deletedUserId === -1) throw new Error("Error with deleteUser().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = `An error occurred rejecting the user with id '${userId}'.`;

            console.log(err);
            res.json(returnData);
        });
};

/** Only moderators and admins should be able to use this. */
exports.banUser = (req, res) => {
    // targetUserId: the user we are banning. They can only be an unapproved or approved user.
    // moderatorUserId: the user doing the banning
    const { targetUserId, moderatorUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel
        .getUserProfileData(moderatorUserId) // first, check that the banner has moderation powers
        .then((profileData) => {
            if (profileData === -1) throw new Error("Error with getUserProfileData().");
            else if (profileData.role < 2) throw new CustomError("Only moderators or administrators can ban users.");

            return UserModel.getUserProfileData(targetUserId); // check that the target is an unapproved or approved user
        })
        .then((profileData) => {
            if (profileData === -1) throw new CustomError("The provided user ID does not belong to any user.");
            else if (profileData.role >= 2) throw new CustomError("You can only ban unapproved or approved users.");

            return UserModel.banUser(moderatorUserId, targetUserId); // we can now ban safely
        })
        .then((bannedUsersCount) => {
            if (bannedUsersCount === -1) throw new Error("Error with banUser().");

            returnData.status = "success";
            returnData.message = `Successfully banned the user with ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred whilst banning the user.";

            console.log(err);
            res.json(returnData);
        });
};

/** Only admins should be able to use this. */
exports.appointModerator = (req, res) => {
    // targetUserId: the user we are promoting from approved user to moderator
    // adminUserId: the user doing the promoting
    const { targetUserId, adminUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel
        .getUserProfileData(adminUserId) // first, check that the promoter is actually an admin
        .then((profileData) => {
            if (profileData === -1) throw new Error("Error with getUserProfileData().");
            else if (profileData.role !== 3) throw new CustomError("Only administrators can appoint moderators.");

            return UserModel.getUserProfileData(targetUserId); // check that the target is an approved user
        })
        .then((profileData) => {
            if (profileData === -1) throw new CustomError("The provided user ID does not belong to any user.");
            else if (profileData.role !== 1) throw new CustomError("The provided user ID does not belong to an approved user.");

            return UserModel.setRole(targetUserId, 2); // we can now promote safely
        })
        .then((userId) => {
            if (userId === -1) throw new Error("Error with setRole().");

            returnData.status = "success";
            returnData.message = `Successfully appointed the moderator with user ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred appointing the moderator.";

            console.log(err);
            res.json(returnData);
        });
};

/** Only admins should be able to use this. */
exports.unappointModerator = (req, res) => {
    // targetUserId: the user we are demoting from moderator to approved user
    // adminUserId: the user doing the demoting
    const { targetUserId, adminUserId } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    UserModel
        .getUserProfileData(adminUserId) // first, check that the demoter is actually an admin
        .then((profileData) => {
            if (profileData === -1) throw new Error("Error with getUserProfileData().");
            else if (profileData.role !== 3) throw new CustomError("Only administrators can unappoint moderators.");

            return UserModel.getUserProfileData(targetUserId); // check that the target is a moderator
        })
        .then((profileData) => {
            if (profileData === -1) throw new CustomError("The provided user ID does not belong to any user.");
            else if (profileData.role !== 2) throw new CustomError("The provided user ID does not belong to a moderator.");

            return UserModel.setRole(targetUserId, 1); // we can now demote safely
        })
        .then((userId) => {
            if (userId === -1) throw new Error("Error with setRole().");

            returnData.status = "success";
            returnData.message = `Successfully unappointed the moderator with user ID ${targetUserId}.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred unappointing the moderator.";

            console.log(err);
            res.json(returnData);
        });
};