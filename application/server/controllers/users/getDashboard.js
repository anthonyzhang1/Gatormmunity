/* This file contains the controller that gets the user's data for the dashboard as well as the most recent
 * Gatormmunity threads and listings. */

const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const ListingModel = require("../../models/ListingModel");
const ThreadModel = require("../../models/ThreadModel");
const UserModel = require("../../models/UserModel");

/**
 * Gets the user's data and the most recent Gatormmunity threads and listings for the dashboard.
 *
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * profile_picture_path: {string} The path to the user's profile picture,
 * threads: {Array} Contains objects containing threads and their data,
 * listings: {Array} Contains objects containing listings and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getDashboard = (req, res) => {
    /** The maximum number of rows to get data from in the database. */
    const NUM_ROWS_RETURNED = 10;
    const { userId } = req.params;
    let returnData = {}; // holds the data that will be sent to the front end

    UserModel.getUserPicturePaths(userId) // get the user's profile picture
        .then((picturePaths) => {
            if (picturePaths === ERROR) throw new Error("Error with getUserPicturePaths().");

            returnData.profile_picture_path = picturePaths.profile_picture_path
            return ThreadModel.getNRecentIdsAndTitles(NUM_ROWS_RETURNED); // get the recent Gatormmunity threads
        })
        .then((threads) => {
            if (threads === ERROR) throw new Error("Error with getNRecentIdsAndTitles().");

            returnData.threads = threads;
            return ListingModel.getNRecentListingIdTitlePrice(NUM_ROWS_RETURNED); // get the recent listings
        })
        .then((listings) => {
            if (listings === ERROR) throw new Error("Error with getNRecentListingIdTitlePrice().");

            returnData.status = SUCCESS_STATUS;
            returnData.listings = listings;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: ERROR_STATUS };
            returnData.message = "An error occurred while getting your dashboard's data.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = getDashboard;