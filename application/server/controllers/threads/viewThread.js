/* This file contains the controller that gets the posts within a thread. */

const { ERROR, SUCCESS_STATUS, ERROR_STATUS } = require("../../helpers/Constants");
const CustomError = require("../../helpers/CustomError");
const GroupModel = require('../../models/GroupModel');
const ThreadModel = require('../../models/ThreadModel');

/**
 * Displays a thread's title and displays all of the posts in the thread. We check if the user is a member of the group
 * the thread belongs to. Threads can have no group, in which case anybody is allowed to view it.
 * 
 * Response on Success:
 * status: {string} SUCCESS_STATUS,
 * title: {string} The thread's title,
 * groupId: {int} The id of the group the thread belongs to,
 * groupRole: {int} The role of the user in the group containing the thread,
 * posts: {Array} Contains objects containing the thread's posts and their data.
 * 
 * Response on Failure:
 * status: {string} ERROR_STATUS,
 * message: {string} An error message that should be shown to the user.
 */
const viewThread = (req, res) => {
    let returnData = {}; // stores what we will send to the front end
    const { threadId, userId } = req.body;

    ThreadModel.getTitleAndGroupId(threadId)
        .then((result) => {
            if (result === ERROR) throw new CustomError(`The thread with id '${threadId}' was not found.`);

            returnData.title = result.title;
            returnData.groupId = result.group_id;
            return GroupModel.getRole(userId, result.group_id); // get the role of the user viewing the thread
        })
        .then((groupRole) => {
            // do not let users view a group's threads unless they are a member of that group
            if (groupRole === ERROR) throw new CustomError("This thread belongs to a group you are not a member of.");

            returnData.groupRole = groupRole;
            return ThreadModel.getPosts(threadId);
        })
        .then((posts) => {
            if (posts === ERROR) throw new Error("An error occurred with getPosts().");

            returnData.status = SUCCESS_STATUS;
            returnData.posts = posts;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred displaying this thread's posts.";

            console.log(err);
            res.json(returnData);
        });
};

module.exports = viewThread;