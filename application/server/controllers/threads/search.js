/* This file contains the controller that gets the search results when the user searches for threads. */

const { SUCCESS_STATUS, SKIP, ERROR_STATUS, THREAD_CREATION_DATE_SORT } = require('../../helpers/Constants');
const ThreadModel = require('../../models/ThreadModel');

/**
 * Performs the thread search operation and sends back an array of threads. The returned threads will either be those
 * that match the search terms, or those that were selected as a suggestion due to no threads matching the search terms.
 *
 * Response on Success:
 * If the search matched threads:
 *     status: {string} SUCCESS_STATUS,
 *     numThreadsMatched: {int} The number of threads sent back,
 *     threads: {Array} Contains objects containing threads and their data.
 * 
 * If the search did not match any threads:
 *     status: {string} SUCCESS_STATUS,
 *     numThreadsMatched: {int} 0, since no threads were matched,
 *     threads: {Array} Contains objects containing suggested threads and their data.
 * 
 * Response on Failure:
 *     status: {string} ERROR_STATUS,
 *     message: {string} An error message that should be shown to the user.
 */
const search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_THREADS = 250; // return a maximum of this many threads
    const NUM_RECOMMENDED_THREADS = 10; // return this many threads if no matches were found
    const { searchTerms, category } = req.body;

    // search for threads with the provided parameters
    ThreadModel.searchThreads(null, searchTerms, category, THREAD_CREATION_DATE_SORT, MAX_MATCHED_THREADS)
        .then((matchedThreads) => {
            // if no matches were found with the provided search terms, display some recommendations
            if (matchedThreads.length === 0) return ThreadModel.getNRecommendedGatorThreads(NUM_RECOMMENDED_THREADS);

            // if threads were matched, send them to the front end
            returnData.status = SUCCESS_STATUS;
            returnData.numThreadsMatched = matchedThreads.length;
            returnData.threads = matchedThreads;
            res.json(returnData);

            return Promise.reject(SKIP); // break out of the .then() promise chain early
        })
        .then((recommendedThreads) => {
            returnData.status = SUCCESS_STATUS;
            returnData.numThreadsMatched = 0; // no matched threads
            returnData.threads = recommendedThreads;

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