/* This file contains the controller that gets the search results when the user searches for listings. */

const { SUCCESS_STATUS, SKIP, ERROR_STATUS } = require('../../helpers/Constants');
const ListingModel = require('../../models/ListingModel');

/**
 * Performs the listing search operation and sends back an array of listings. The returned listings will either be those
 * that match the search terms, or those that were selected as a suggestion due to no listings matching the search terms.
 *
 * Response on Success:
 * If the search matched listings:
 *     status: {string} SUCCESS_STATUS,
 *     numListingsMatched: {int} The number of listings sent back,
 *     listings: {Array} Contains objects containing listings and their data.
 * 
 * If the search did not match any listings:
 *     status: {string} SUCCESS_STATUS,
 *     numListingsMatched: {int} 0, since no listings were matched,
 *     listings: {Array} Contains objects containing suggested listings and their data.
 * 
 * Response on Failure:
 *     status: {string} ERROR_STATUS,
 *     message: {string} An error message that should be shown to the user.
 */
const search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_LISTINGS = 250; // return a maximum of this many listings
    const NUM_RECOMMENDED_LISTINGS = 10; // return this many listings if no matches were found
    const { searchTerms, category, maxPrice: maxPriceString } = req.body;
    const maxPrice = maxPriceString ? parseFloat(maxPriceString) : null; // convert maxPrice to a float, if it was provided

    // search for listings with the provided parameters
    ListingModel.searchListings(searchTerms, category, maxPrice, MAX_MATCHED_LISTINGS)
        .then((matchedListings) => {
            // if no matches were found with the provided search terms, display some recommendations
            if (matchedListings.length === 0) return ListingModel.getNRecommendedListings(NUM_RECOMMENDED_LISTINGS);

            // if listings were matched, send them to the front end
            returnData.status = SUCCESS_STATUS;
            returnData.numListingsMatched = matchedListings.length;
            returnData.listings = matchedListings;
            res.json(returnData);

            return Promise.reject(SKIP); // break out of the .then() promise chain early
        })
        .then((recommendedListings) => {
            returnData.status = SUCCESS_STATUS;
            returnData.numListingsMatched = 0; // no matched listings
            returnData.listings = recommendedListings;

            res.json(returnData);
        })
        .catch((err) => {
            if (err === SKIP) return; // if returnData has already been sent, do nothing

            returnData.status = ERROR_STATUS;
            returnData.message = "An error occurred while performing your search.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = search;