const path = require("path");
const fs = require("fs");
const { ERROR_STATUS, SUCCESS_STATUS } = require("../helpers/Constants");
const createThumbnail = require("../helpers/CreateThumbnail");
const CustomError = require("../helpers/CustomError");
const GroupModel = require('../models/GroupModel');
const PostModel = require('../models/PostModel');
const ThreadModel = require('../models/ThreadModel');

/**
 * Performs the thread search operation and sends back an array of threads. The returned threads will either be those
 * that match the search terms, or those that were selected as a suggestion due to no threads matching the search terms.
 *
 * The back end sends:
 * If the search matched threads:
 *     status: {string} "success",
 *     numThreadsMatched: {int} The number of threads sent back,
 *     threads: {Object} Contains the matched threads and their attributes.
 * If the search did not match any threads:
 *     status: {string} "success",
 *     numThreadsMatched: {int} 0, since no threads were matched,
 *     threads: {Object} Contains the suggested threads and their attributes.
 * If the search encountered an error:
 *     status: {string} "error",
 *     message: {string} The error message to show the user.
 */
exports.search = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_THREADS = 250; // return a maximum of this many threads
    const NUM_RECOMMENDED_THREADS = 10; // return this many threads if no matches were found
    const { searchTerms, category } = req.body;

    // search for threads with the provided parameters in the database
    ThreadModel
        .searchThreads(null, searchTerms, category, MAX_MATCHED_THREADS)
        .then((matchedThreads) => {
            // if no matches were found with the provided search terms,
            // query the database for a few of the most recently created threads instead
            if (matchedThreads.length === 0) return ThreadModel.getNRecommendedGatorThreads(NUM_RECOMMENDED_THREADS);

            // if threads were matched, send them to the front end
            returnData.status = "success";
            returnData.numThreadsMatched = matchedThreads.length;
            returnData.threads = matchedThreads;

            res.json(returnData);
            return Promise.reject("SKIP"); // break out of the .then() promise chain early
        })
        .then((recommendedThreads) => {
            returnData.status = "success";
            returnData.numThreadsMatched = 0; // no matched threads
            returnData.threads = recommendedThreads;

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

/**
 * Creates a thread either for Gatormmunity or for a group, depending on what groupId's value is.
 * The thread's original post and optionally, its attachment, is created too.
 * 
 * The back end sends:
 * On successful thread creation:
 *     status: {string} "success",
 *     threadId: {int} The id of the new thread.
 * 
 * On failure:
 *     status: {string} "error",
 *     message: {string} The error message to display the user.
 */
exports.createThread = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { threadTitle, threadBody, category, groupId, creatorId } = req.body;

    /* The thread image is optional, thus we check if `req.file` exists first before assigning these variables a value. */
    const threadImagePath = req.file ? req.file.path : null;
    const threadImageThumbnailPath = req.file ? path.join(req.file.destination, `tn-${req.file.filename}`) : null;
    const threadImageOriginalFilename = req.file ? req.file.originalname : null;

    createThumbnail(req.file, threadImagePath, threadImageThumbnailPath, 250, 250)
        .then(() => { // if the thumbnail was successfully created, create the thread
            return ThreadModel.createThread(threadTitle, category, groupId, creatorId);
        })
        .then((threadId) => {
            if (threadId < 0) throw new Error("Error with createThread().");

            returnData.threadId = threadId;
            return PostModel.createPost(threadBody, true, threadId, creatorId); // create the thread's original post
        })
        .then((postId) => {
            if (postId < 0) throw new Error("Error with createPost().");

            // If a thread image was provided, attach it to the post, otherwise, we are done and can send back `returnData`.
            if (threadImagePath) {
                return PostModel.createAttachment(threadImageOriginalFilename, threadImagePath,
                    threadImageThumbnailPath, postId);
            } else {
                returnData.status = SUCCESS_STATUS;
                res.json(returnData); // send the success to the front end

                return Promise.reject("SKIP"); // break out of the .then() promise chain early
            }
        })
        .then(attachmentId => {
            if (attachmentId < 0) throw new Error("Error with createAttachment().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData); // send the success to the front end
        })
        .catch((err) => {
            if (err === "SKIP") return; // if returnData has already been sent, do nothing

            returnData = { status: ERROR_STATUS };
            returnData.message = "An error occurred while creating your thread.";

            // delete the uploaded files on failed thread creation, if they exist
            if (threadImagePath) {
                fs.unlink(threadImagePath, () => { });
                fs.unlink(threadImageThumbnailPath, () => { });
            }

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
};

/**
 * Displays a thread's title and displays all of the posts in the thread. We check if the user is a member of the group
 * the thread belongs to. Threads can have no group, in which case anybody is allowed to view it.
 * 
 * The back end sends:
 * On success:
 *     status: {string} "success",
 *     title: {string} The thread's title,
 *     posts: {Array} Each element is an object containing posts with the data required to display a post on the front end,
 *     groupRole: {int} The role of the user in the group containing the thread.
 * 
 * On failure:
 *     status: {string} "error",
 *     message: {string} The error message that the user should be shown.
 */
exports.viewThread = (req, res) => {
    let returnData = {}; // stores what we will send to the front end
    const { threadId, userId } = req.body;

    ThreadModel
        .getTitleAndGroup(threadId)
        .then((result) => {
            if (result === -1) throw new CustomError(`The thread with id '${threadId}' was not found.`);

            returnData.title = result.title;
            returnData.groupId = result.group_id;
            return GroupModel.getRole(userId, result.group_id);
        })
        .then((groupRole) => {
            // do not let users view a group's threads unless they are a member of that group
            if (groupRole === -1) throw new CustomError("This thread belongs to a group you are not a member of.");

            returnData.groupRole = groupRole;
            return ThreadModel.getPosts(threadId);
        })
        .then((posts) => {
            if (posts === -1) throw new Error("An error occurred with getPosts().");

            returnData.status = "success";
            returnData.posts = posts;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: "error" };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred displaying this thread's posts.";

            console.log(err);
            res.json(returnData);
        });
};

/** Deletes a thread and its images. */
exports.deleteThread = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { threadId } = req.body;

    ThreadModel
        .getThreadPicturePaths(threadId)
        .then((picturePaths) => {
            if (picturePaths === -1) throw new Error("Error with getThreadPicturePaths().");

            // delete the thread's picture and thumbnail, if it exists
            if (picturePaths) {
                fs.unlink(picturePaths.image_path, () => { });
                fs.unlink(picturePaths.thumbnail_path, () => { });
            }

            return ThreadModel.deleteThread(threadId); // now we can safely delete the thread
        })
        .then((deletedThreadId) => {
            if (deletedThreadId === -1) throw new Error("Error with deleteThread().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the thread due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

/** Deletes a post. Does not delete original posts, however. Therefore, we do not need to check for images. */
exports.deletePost = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { postId } = req.body;

    PostModel
        .isOriginalPost(postId) // check to make sure we are not deleting an original post
        .then((isOriginalPost) => {
            if (isOriginalPost === -1) throw new CustomError("There is no post with that id.");
            else if (isOriginalPost) throw new CustomError("You cannot delete original posts.");

            return PostModel.deletePost(postId); // safely delete the post
        })
        .then((deletedPostId) => {
            if (deletedPostId === -1) throw new Error("Error with deletePost().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the post due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

/**
 * Makes a post in an existing thread.
 * 
 * The back end sends:
 * On successful post creation:
 *     status: {string} "success".
 * 
 * On failure:
 *     status: {string} "error",
 *     message: {string} The error message that the user should be shown.
 */
exports.makePost = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { body, threadId, authorId } = req.body;

    PostModel
        .createPost(body, false, threadId, authorId)
        .then((postId) => {
            if (postId < 0) throw new Error("Error with createPost().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "An error occurred with creating your post.";

            console.log(err);
            res.json(returnData);
        });
};

exports.getThreads = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end

    const MAX_MATCHED_THREADS = 250; // return a maximum of this many threads
    const { category, groupId, userId } = req.body;

    GroupModel
        .getRole(userId, groupId) // make sure the user is a member of the group, if applicable
        .then((groupRole) => {
            if (groupRole === -1) throw new CustomError("You are not a member of this group.");

            returnData.groupRole = groupRole;
            return ThreadModel.searchThreads(groupId, null, category, MAX_MATCHED_THREADS)
        })
        .then((threads) => {
            if (!threads) throw new Error("Error with searchGatorThreads().");

            returnData.threads = threads; // these threads are ready to be sent back, regardless of gator or group forums

            if (groupId) return GroupModel.getGroupName(groupId); // if we are getting a group's threads, get the group's name

            // if we are getting gator threads, we can send the data back now
            returnData.status = "success";
            res.json(returnData);
            return Promise.reject("SKIP"); // break out of the .then() promise chain early
        })
        .then((groupName) => {
            if (groupName === -1) throw new Error("Error with getGroupName().");

            returnData.status = "success";
            returnData.groupName = groupName;
            res.json(returnData);
        })
        .catch((err) => {
            // if returnData has already been sent, do nothing
            if (err === "SKIP") return;

            returnData = { status: "error" }; // clear out the old returnData values
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get the threads due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};