const path = require("path");
const fs = require("fs");
const createThumbnail = require("../helpers/CreateThumbnail");
const CustomError = require("../helpers/CustomError");
const ListingModel = require('../models/ListingModel');
const UserModel = require("../models/UserModel");

/** Returns the listing's data and the seller's information if the listingId exists. */
exports.viewListing = (req, res) => {
    let returnData = {};
    const { listingId } = req.params;

    ListingModel
        .getListingData(listingId)
        .then((listingData) => {
            if (listingData === -1) throw new CustomError(`There is no listing with id '${listingId}'.`);

            returnData.status = "success";
            returnData.listing = listingData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to display this listing due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

/**
 * Creates a listing in the marketplace. A thumbnail is created for the image provided.
 * 
 * The back end sends:
 * On successful listing creation:
 *     status: {string} "success",
 *     listingId: {int} Contains the newly created listing's id.
 * 
 * On failure:
 *     status: {string} "error",
 *     message: {string} The error message to show the user.
 */
exports.createListing = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const { listingTitle, listingDescription, price: priceString, category, sellerId } = req.body;
    const listingImagePath = req.file.path;
    const listingImageThumbnailPath = path.join(req.file.destination, `tn-${req.file.filename}`);

    createThumbnail(req.file, listingImagePath, listingImageThumbnailPath, 150, 150)
        .then(() => {
            // if the thumbnail was successfully created, create the listing
            return ListingModel.createListing(listingTitle, listingDescription, parseFloat(priceString), category,
                listingImagePath, listingImageThumbnailPath, sellerId);
        })
        .then((listingId) => {
            if (listingId < 0) throw new Error("Error with createListing().");

            returnData.status = "success";
            returnData.listingId = listingId;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "An error occurred while creating your listing.";

            // delete the uploaded files on failed listing creation
            fs.unlink(listingImagePath, () => { });
            fs.unlink(listingImageThumbnailPath, () => { });

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
};

/** Deletes a listing as long as the person deleting is the listing's creator or a moderator. */
exports.deleteListing = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    let sellerId = -1; // the seller id will be retrieved later
    const { listingId, userId } = req.body;

    ListingModel
        .getSellerId(listingId) // get the seller id of the listing to check later
        .then((returnedSellerId) => {
            if (returnedSellerId === -1) throw new CustomError("There is no listing with that id.");

            sellerId = returnedSellerId;
            return UserModel.getRole(userId); // if the user is not the seller, then they should be a moderator
        })
        .then((userRole) => {
            if (userRole === -1) { // invalid user id
                throw new CustomError("There is no user with that id.");
            } else if (sellerId !== userId && userRole < 2) { // wrong permissions
                throw new CustomError("Only the seller and moderators can delete listings.");
            }

            return ListingModel.getListingPicturePaths(listingId); // permissions valid, now delete the listing's pictures
        })
        .then((picturePaths) => {
            if (picturePaths === -1) throw new Error("Error with getListingPicturePaths().");

            // delete the listing's picture and thumbnail
            fs.unlink(picturePaths.image_path, () => { });
            fs.unlink(picturePaths.image_thumbnail_path, () => { });
            
            return ListingModel.deleteListing(listingId); // now we can safely delete the listing
        })
        .then((deletedListingId) => {
            if (deletedListingId === -1) throw new Error("Error with deleteListing().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the listing due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

/**
 * Performs the listing search operation and sends back an array of listings. The returned listings will either be those
 * that match the search terms, or those that were selected as a suggestion due to no listings matching the search terms.
 *
 * The back end sends:
 * If the search matched listings:
 *     status: {string} "success",
 *     numListingsMatched: {int} The number of listings sent back,
 *     listings: {Object} Contains the matched listings and their attributes.
 * 
 * If the search did not match any listings:
 *     status: {string} "success",
 *     numListingsMatched: {int} 0, since no listings were matched,
 *     listings: {Object} Contains the suggested listings and their attributes.
 * 
 * If the search encountered an error:
 *     status: {string} "error",
 *     message: {string} The error message to show the user.
 */
exports.search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_LISTINGS = 250; // return a maximum of this many listings
    const NUM_RECOMMENDED_LISTINGS = 10; // return this many listings if no matches were found
    const { searchTerms, category, maxPrice: maxPriceString } = req.body;
    const maxPrice = maxPriceString ? parseFloat(maxPriceString) : null; // convert maxPrice to a float

    // search for listings with the provided parameters in the database
    ListingModel
        .searchListings(searchTerms, category, maxPrice, MAX_MATCHED_LISTINGS)
        .then((matchedListings) => {
            // if no matches were found with the provided search terms,
            // query the database for a few of the most recently created listings instead
            if (matchedListings.length === 0) return ListingModel.getNRecommendedListings(NUM_RECOMMENDED_LISTINGS);

            // if listings were matched, send them to the front end
            returnData.status = "success";
            returnData.numListingsMatched = matchedListings.length;
            returnData.listings = matchedListings;

            res.json(returnData);
            return Promise.reject("SKIP"); // break out of the .then() promise chain early
        })
        .then((recommendedListings) => {
            returnData.status = "success";
            returnData.numListingsMatched = 0; // no matched listings
            returnData.listings = recommendedListings;

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

exports.getListings = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const MAX_MATCHED_LISTINGS = 250; // return a maximum of this many listings

    const { category, maxPrice: maxPriceString } = req.body;
    const maxPrice = maxPriceString ? parseFloat(maxPriceString) : null; // convert maxPrice to a float

    // search for listings with the provided parameters in the database
    ListingModel
        .searchListings(null, category, maxPrice, MAX_MATCHED_LISTINGS)
        .then((listings) => {
            if (!listings) throw new Error("Error with searchListings().");

            returnData.status = "success";
            returnData.listings = listings;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "We were unable to get the listings due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};