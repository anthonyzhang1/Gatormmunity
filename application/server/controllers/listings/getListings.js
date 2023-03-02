/* This file contains the controller that gets the most recently created listings for the marketplace page. */

const { SUCCESS_STATUS, ERROR_STATUS } = require('../../helpers/Constants');
const ListingModel = require('../../models/ListingModel');

/**
 * Gets the recently created listings, with the limit being defined in the controller.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * listings: {Array} Contains objects containing listings and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const getListings = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const MAX_MATCHED_LISTINGS = 250; // return a maximum of this many listings

    const { category, maxPrice: maxPriceString } = req.body;
    const maxPrice = maxPriceString ? parseFloat(maxPriceString) : null; // convert maxPrice to a float, if it was provided

    // search for listings with the provided parameters, with any title
    ListingModel.searchListings(null, category, maxPrice, MAX_MATCHED_LISTINGS)
        .then((listings) => {
            if (!listings) throw new Error("Error with searchListings().");

            returnData.status = SUCCESS_STATUS;
            returnData.listings = listings;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;
            returnData.message = "We were unable to get the listings due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = getListings;