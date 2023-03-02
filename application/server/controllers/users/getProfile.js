/* This file contains the controller that gets the data for a user's profile page, including the recent activities. */

const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const ListingModel = require("../../models/ListingModel");
const PostModel = require("../../models/PostModel");
const ThreadModel = require("../../models/ThreadModel");
const UserModel = require("../../models/UserModel");

/**
 * Gets the profile page data for a user including their recent activities.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * recentActivities: {Array} Contains objects containing recent activities (threads and listings).
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getProfile = (req, res) => {
    /** The maximum number of activities to return for the user. */
    const NUM_ACTIVITIES_SHOWN = 15;
    const { userId } = req.params;

    let returnData = {}; // stores what the back end will send to the front end
    let recentActivities = []; // stores the user's recent activities

    UserModel.getUserProfileData(userId) // get the user's personal data, e.g. name and role
        .then((profileData) => {
            if (profileData === ERROR) throw new CustomError(`The user with id '${userId}' was not found.`);

            returnData.user = profileData;
            // get the recent threads created by the user
            return ThreadModel.getUserNLastGatorThreadsCreated(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((threads) => {
            if (threads === ERROR) throw new Error("An error occured with getUserNLastGatorThreadsCreated().");

            recentActivities.push(...threads);
            // get the recent posts created by the user, excluding original posts
            return PostModel.getUserNLastGatorThreadsPostedIn(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((threads) => {
            if (threads === ERROR) throw new Error("An error occured with getUserNLastGatorThreadsPostedIn().");

            recentActivities.push(...threads);
            // get the recent listings created by the user
            return ListingModel.getUserNLastListings(userId, NUM_ACTIVITIES_SHOWN);
        })
        .then((listings) => {
            if (listings === ERROR) throw new Error("An error occured with getUserNLastListings().");

            recentActivities.push(...listings);

            // Sort the activites by creation date, in descending order. Newest activities first.
            recentActivities.sort((a, b) => {
                if (a.creation_date > b.creation_date) return -1;
                else if (a.creation_date < b.creation_date) return 1;
                else return 0;
            });

            returnData.status = SUCCESS_STATUS;
            // only return the most recent NUM_ACTIVITIES_SHOWN activities
            returnData.recentActivities = recentActivities.slice(0, NUM_ACTIVITIES_SHOWN);
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: ERROR_STATUS };

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to display this user's profile. Please try again.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getProfile;