/* This file contains the controller that deletes listings and its images. */

const fs = require("fs");
const { ERROR, ERROR_STATUS, MODERATOR_ROLE, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const ListingModel = require('../../models/ListingModel');
const UserModel = require("../../models/UserModel");

/**
 * Deletes a listing from the database. The listing's images are also deleted.
 * Only the listing's seller or a moderator can delete listings.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const deleteListing = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    let sellerId = -1; // the seller id will be retrieved later
    const { listingId, userId } = req.body;

    ListingModel.getSellerId(listingId) // get the seller id of the listing to check later
        .then((returnedSellerId) => {
            if (returnedSellerId === ERROR) throw new CustomError("There is no listing with that id.");

            sellerId = returnedSellerId;
            return UserModel.getRole(userId); // get the role of the user trying to delete the listing
        })
        .then((userRole) => {
            if (userRole === ERROR) { // invalid user id
                throw new CustomError("There is no user with that id.");
            } else if (userId !== sellerId && userRole < MODERATOR_ROLE) { // wrong permissions
                throw new CustomError("Only the seller and moderators can delete listings.");
            }

            return ListingModel.getListingPicturePaths(listingId); // permissions valid, now delete the listing's pictures
        })
        .then((picturePaths) => {
            if (picturePaths === ERROR) throw new Error("Error with getListingPicturePaths().");

            // delete the listing's picture and thumbnail
            fs.unlink(picturePaths.image_path, () => { });
            fs.unlink(picturePaths.image_thumbnail_path, () => { });

            return ListingModel.deleteListing(listingId); // now we can safely delete the listing
        })
        .then((deletedListingId) => {
            if (deletedListingId === ERROR) throw new Error("Error with deleteListing().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the listing due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

module.exports = deleteListing;