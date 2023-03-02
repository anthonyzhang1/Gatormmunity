const path = require("path");
const fs = require("fs");
const { ERROR_STATUS, SUCCESS_STATUS } = require("../helpers/Constants");
const createThumbnail = require("../helpers/CreateThumbnail");
const CustomError = require("../helpers/CustomError");
const DirectMessageModel = require("../models/DirectMessageModel");
const GroupModel = require("../models/GroupModel");
const UserModel = require("../models/UserModel");

exports.createGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    let groupId = -1; // the new group's id. we save its value here in case addGroupUser() throws an error

    const { groupName, groupDescription, adminId } = req.body;
    const groupPicturePath = req.file.path;
    const groupPictureThumbnailPath = path.join(req.file.destination, `tn-${req.file.filename}`);

    createThumbnail(req.file, groupPicturePath, groupPictureThumbnailPath, 60, 60)
        .then(() => { // if the thumbnail was successfully created, check if the user exists before making a group
            return UserModel.userExists(adminId);
        })
        .then((userExists) => {
            if (!userExists) throw new CustomError("Your user id is invalid. Please log out and try again.");

            return GroupModel.groupNameExists(groupName);
        })
        .then((groupExists) => {
            if (groupExists) throw new CustomError(`The group name ${groupName} is already in use.`);

            return GroupModel.createGroup(groupName, groupDescription, groupPicturePath, groupPictureThumbnailPath);
        })
        .then((returnedGroupId) => {
            if (returnedGroupId < 0) throw new Error("Error with createGroup().");

            // After creating the group, assign the user who created the group as the group's admin
            groupId = returnedGroupId;
            return GroupModel.addGroupUser(returnedGroupId, adminId, 3);
        })
        .then((userId) => {
            if (userId < 0) throw new Error("Error with addGroupUser().");

            returnData.status = "success";
            returnData.groupId = groupId;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred while creating your group.";

            // delete the uploaded files on failed group creation
            fs.unlink(groupPicturePath, () => { });
            fs.unlink(groupPictureThumbnailPath, () => { });

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

exports.joinGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, joinCode: providedJoinCode, userId } = req.body;

    GroupModel
        .getRole(userId, groupId) // check if the user is already a member of the group
        .then((roleNumber) => {
            if (roleNumber !== -1) throw new CustomError("You are already a member of this group.");

            return GroupModel.getJoinCode(groupId);
        })
        .then((joinCode) => {
            if (providedJoinCode !== joinCode) throw new CustomError("Invalid join code.");

            return GroupModel.addGroupUser(groupId, userId, 1); // join the group as a group member
        })
        .then((returnedUserId) => {
            if (returnedUserId === -1) throw new Error("Error with addGroupUser().");

            returnData.status = SUCCESS_STATUS;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "You were unable to join the group due to a server error. Please try again.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

/** Lets a group user leave a group by deleting their entry from the group_user table. */
exports.leaveGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, userId } = req.body;

    GroupModel
        .getRole(userId, groupId) // check that the user is a member of the group and not the admin
        .then((role) => {
            if (role === -1) throw new CustomError("You cannot leave a group you are not a member of.");
            else if (role === 3) throw new CustomError("You cannot leave your group because you are its group administrator.");

            return GroupModel.deleteGroupUser(groupId, userId); // leave the group
        })
        .then((groupId) => {
            if (groupId === -1) throw new Error("Error with deleteGroupUser().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "You were unable to leave the group due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
}

/** Deletes a group by deleting its entry from the group table. The cascade foreign key should delete all associations
  * with the group. */
exports.deleteGroup = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { groupId, userId } = req.body;

    GroupModel
        .getRole(userId, groupId) // check that the user is the admin of the group
        .then((role) => {
            if (role !== 3) throw new CustomError("Only group admins can delete their group.");

            return GroupModel.getGroupPicturePaths(groupId); // delete the group's pictures first
        })
        .then((picturePaths) => {
            if (picturePaths === -1) throw new Error("Error with getGroupPicturePaths().");

            // delete the group's picture and thumbnail
            fs.unlink(picturePaths.picture_path, () => { });
            fs.unlink(picturePaths.picture_thumbnail_path, () => { });
            return GroupModel.deleteGroup(groupId);
        })
        .then((deletedGroupId) => {
            if (deletedGroupId === -1) throw new Error("Error with deleteGroup().");

            returnData.status = "success";
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            // do not show the user an error message they won't understand if the error is not one we expected
            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to delete the group due to a server error.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
};

exports.getGroupHome = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel
        .getRole(userId, groupId) // check that the user is a member of the group
        .then((role) => {
            if (role === -1) throw new CustomError("You are not a member of this group.");

            return GroupModel.getGroupHomeData(groupId);
        })
        .then((groupData) => {
            if (groupData === -1) throw new CustomError(`There is no group with id '${groupId}'.`);

            returnData.status = "success";
            returnData.group = groupData;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get this group's home page. Please try again.";

            console.log(err);
            res.json(returnData);
        });
};

exports.getMembers = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel
        .getRole(userId, groupId) // check that the user is a member of the group and save their role
        .then((role) => {
            if (role === -1) throw new CustomError("You are not a member of this group.");

            returnData.groupRole = role;
            return GroupModel.getGroupName(groupId);
        })
        .then((groupName) => {
            if (groupName === -1) throw new Error("Error with getGroupName().");

            returnData.groupName = groupName;
            return GroupModel.getGroupUsers(groupId);
        })
        .then((groupUsers) => {
            if (groupUsers === -1) throw new Error("Error with getGroupUsers().");

            returnData.status = "success";
            returnData.users = groupUsers;
            res.json(returnData);
        })
        .catch((err) => {
            returnData = { status: "error" };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get this group's members. Please ensure the group's id is correct.";

            console.log(err);
            res.json(returnData);
        });
};

exports.kickMember = (req, res) => {
    // groupId: the group the user is being kicked from
    // targetUserId: the user being kicked. They must be a group member.
    // targetName: the name of the user being kicked
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    GroupModel
        .getRole(targetUserId, groupId) // make sure the target user is a group member
        .then((groupRole) => {
            if (groupRole !== 1) throw new CustomError("You can only kick group members from a group.");

            return GroupModel.deleteGroupUser(groupId, targetUserId);
        })
        .then((returnedGroupId) => {
            if (returnedGroupId === -1) throw new Error("Error with deleteGroupUser().");

            returnData.status = "success";
            returnData.message = `${targetName} has been kicked from the group.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred whilst kicking the user from the group.";

            console.log(err);
            res.json(returnData);
        });
};

exports.promoteMember = (req, res) => {
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    GroupModel
        .getRole(targetUserId, groupId) // make sure the target user is a group member
        .then((groupRole) => {
            if (groupRole !== 1) throw new CustomError("You can only promote group members to group moderators.");

            return GroupModel.setRole(groupId, targetUserId, 2);
        })
        .then((affectedRows) => {
            if (affectedRows === -1) throw new Error("Error with setRole().");

            returnData.status = "success";
            returnData.message = `${targetName} has been promoted to a group moderator.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred promoting the group member.";

            console.log(err);
            res.json(returnData);
        });
};

exports.demoteModerator = (req, res) => {
    const { groupId, targetUserId, targetName } = req.body;
    let returnData = {}; // stores what the back end will send to the front end

    GroupModel
        .getRole(targetUserId, groupId) // make sure the target user is a group moderator
        .then((groupRole) => {
            if (groupRole !== 2) throw new CustomError("You can only demote group moderators to group members.");

            return GroupModel.setRole(groupId, targetUserId, 1); // set group mod to group member
        })
        .then((affectedRows) => {
            if (affectedRows === -1) throw new Error("Error with setRole().");

            returnData.status = "success";
            returnData.message = `${targetName} has been demoted to a group member.`;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "An error occurred demoting the group moderator.";

            console.log(err);
            res.json(returnData);
        });
};

exports.getCreateThread = (req, res) => {
    let returnData = {};
    const { userId, groupId } = req.params;

    GroupModel
        .getRole(userId, groupId) // check that the user is a member of the group
        .then((role) => {
            if (role === -1) throw new CustomError("You are not a member of this group.");

            return GroupModel.getGroupName(groupId);
        })
        .then((groupName) => {
            if (groupName === -1) throw new CustomError(`There is no group with the id '${groupId}'.`);

            returnData.status = "success";
            returnData.groupName = groupName;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to display this page. Please try again.";

            console.log(err);
            res.json(returnData);
        });
}

/** Gets all the groups the user is in. The `groups` array can be empty. */
exports.getUsersGroups = (req, res) => {
    let returnData = {};
    const { userId } = req.params;

    GroupModel
        .getUsersGroups(userId)
        .then((groups) => {
            if (groups === -1) throw new Error("Error with getUsersGroups().");

            returnData.status = "success";
            returnData.groups = groups;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";
            returnData.message = "A server error occurred trying to get your groups.";

            console.log(err);
            res.json(returnData);
        });
};

/** Gets the group chats for a user. */
exports.getGroupChats = (req, res) => {
    let returnData = {}; // will be returned to the front end
    const { userId } = req.params;

    UserModel
        .userExists(userId) // ensure that the user exists before fetching their chat groups
        .then((userExists) => {
            if (!userExists) throw new CustomError(`There is no user with the id '${userId}'.`);

            return GroupModel.getGroupChats(userId);
        })
        .then((groupChats) => {
            if (groupChats === -1) throw new Error("Error with getChatGroups().");

            returnData.status = SUCCESS_STATUS;
            returnData.groups = groupChats;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get your group chats due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

/** Gets the chat messages for a user. */
exports.getNChatMessages = (req, res) => {
    /** The maximum number of chat messages to retrieve from the database. */
    const MAX_MESSAGES_RETRIEVED = 100;
    let returnData = {};
    const { userId, groupId: groupIdString } = req.params;

    let groupId = parseInt(groupIdString);
    if (groupId === 0) groupId = null; // check if the groupId is for Gator Chat

    GroupModel
        .getRole(userId, groupId) // ensure the user is a member of the group before getting the group chat messages
        .then((groupRole) => {
            if (groupRole === -1) throw new CustomError("You are not a member of this group.");

            return GroupModel.getNChatMessages(groupId, MAX_MESSAGES_RETRIEVED);
        })
        .then((chatMessages) => {
            if (!chatMessages) throw new Error("Error with getNChatMessages().");

            returnData.status = SUCCESS_STATUS;
            returnData.messages = chatMessages;
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = ERROR_STATUS;

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "We were unable to get the group's messages due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

/** Inserts a chat message into the database. */
exports.createChatMessage = (req, res) => {
    const { body, groupId: groupIdString, senderId } = req.body;

    let groupId = parseInt(groupIdString);
    if (groupId === 0) groupId = null; // check if the groupId is for Gator Chat

    GroupModel
        .getRole(senderId, groupId) // ensure the user is a member of the group before creating the message
        .then((groupRole) => {
            if (groupRole === -1) throw new CustomError("You are not a member of this group.");

            return GroupModel.createChatMessage(body, groupId, senderId);
        })
        .then((chatMessageId) => {
            if (chatMessageId === -1) throw new Error("Error with createChatMessage().");

            res.json({ status: SUCCESS_STATUS }); // tell the front end the operation was successful
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "Your message was unable to be sent due to a server error.";

            console.log(err);
            res.json(returnData);
        });
};

exports.changeAnnouncement = (req, res) => {
    let returnData = {}; // holds the data that will be sent to the front end
    const { announcement, groupId, userId } = req.body;

    GroupModel
        .getRole(userId, groupId) // verify that the person changing the announcement is the group's admin
        .then((role) => {
            if (role !== 3) throw new CustomError("Only the group's admin can change the group's announcement.");

            GroupModel.changeAnnouncement(groupId, announcement);
        })
        .then((affectedRows) => {
            if (affectedRows === -1) throw new Error("Error with changeAnnouncement().");

            returnData.status = 'success';
            res.json(returnData);
        })
        .catch((err) => {
            returnData.status = "error";

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "A server error occurred whilst changing your announcement.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        });
}

/** Sends an invite message to a user. */
exports.groupInvite = (req, res) => {
    let group = {}; // used to save the data for the join code
    const { groupId, senderId, recipientId } = req.body;

    UserModel
        .getRole(recipientId) // ensure that the recipient exists
        .then((recipientRole) => {
            if (recipientRole === -1) throw new CustomError(`There is no user with the id '${recipientId}'.`);

            return GroupModel.getGroupName(groupId); // the group's name is used for the invite message
        })
        .then((groupName) => {
            if (groupName === -1) throw new CustomError(`There is no group with the id '${groupId}'.`);

            group.name = groupName;
            return GroupModel.getJoinCode(groupId);
        })
        .then((joinCode) => {
            if (joinCode === -1) throw new Error('Error with getJoinCode().');

            group.joinCode = joinCode;
            // check if a conversation exists between the sender and recipient before sending a direct message
            return DirectMessageModel.getConversationId(senderId, recipientId);
        })
        .then((conversationId) => { // If a conversation doesn't exist yet, create one.
            if (conversationId === -1) return DirectMessageModel.createConversation(senderId, recipientId);
            else return conversationId;
        })
        .then((conversationId) => {
            if (conversationId === -1) throw new Error('Error with createConversation().');

            const messageBody = `I am inviting you to our group "${group.name}"! Here is the invitation link: ` +
                `http://54.241.101.69/join-group/${groupId}/${group.joinCode}`;

            return DirectMessageModel.createMessage(messageBody, senderId, conversationId);
        })
        .then((directMessageId) => {
            if (directMessageId === -1) throw new Error('Error with createMessage().');

            res.json({ status: SUCCESS_STATUS }); // tell the front end of the successful invite
        })
        .catch((err) => {
            let returnData = { status: ERROR_STATUS };

            if (err instanceof CustomError) returnData.message = err.message;
            else returnData.message = "A server error occurred whilst sending your invite.";

            console.log(err);
            res.json(returnData); // tell the front end of the failure
        })
};