/* This file contains the controller that gets a listing's data for the View Listing page. */

const { ERROR, ERROR_STATUS, SUCCESS_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const ListingModel = require('../../models/ListingModel');

/**
 * Gets the listing's data and the seller's information.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * listing: {Object} Contains the listing's data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const viewListing = (req, res) => {
    let returnData = {};
    const { listingId } = req.params;

    ListingModel.getListingData(listingId)
        .then((listingData) => {
            if (listingData === ERROR) throw new CustomError(`There is no listing with id '${listingId}'.`);

            returnData.status = SUCCESS_STATUS;
            returnData.listing = listingData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to display this listing due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = viewListing;