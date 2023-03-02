/* This file contains the controller that creates listings and its thumbnail. */

const path = require("path");
const fs = require("fs");
const createThumbnail = require("../../helpers/CreateThumbnail");
const ListingModel = require('../../models/ListingModel');
const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");

/**
 * Creates a listing in the marketplace. A thumbnail is created for the image provided.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * listingId: {int} The newly created listing's id.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const createListing = (req, res) => {
    /** The width of the thumbnail to be created, in pixels. */
    const THUMBNAIL_WIDTH = 150;
    /** The height of the thumbnail to be created, in pixels. */
    const THUMBNAIL_HEIGHT = 150

    const { listingTitle, listingDescription, price: priceString, category, sellerId } = req.body;
    const price = parseFloat(priceString);
    const listingImagePath = req.file.path;
    const listingImageThumbnailPath = path.join(req.file.destination, `tn-${req.file.filename}`);

    let returnData = {}; // holds the data that will be sent to the front end

    createThumbnail(req.file, listingImagePath, listingImageThumbnailPath, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT)
        .then(() => {
            // if the thumbnail was successfully created, create the listing
            return ListingModel.createListing(listingTitle, listingDescription, price, category,
                listingImagePath, listingImageThumbnailPath, sellerId);
        })
        .then((listingId) => {
            if (listingId === ERROR) throw new Error("Error with createListing().");

            returnData.status = SUCCESS_STATUS;
            returnData.listingId = listingId;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "An error occurred while creating your listing.";

            // delete the uploaded files on failed listing creation
            fs.unlink(listingImagePath, () => { });
            fs.unlink(listingImageThumbnailPath, () => { });

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
};

module.exports = createListing;