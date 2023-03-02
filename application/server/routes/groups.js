/* This file handles the routing for the group controllers. */

const express = require("express");
const router = express.Router();
const changeAnnouncement = require('../controllers/groups/changeAnnouncement');
const createChatMessage = require('../controllers/groups/createChatMessage');
const createGroup = require('../controllers/groups/createGroup');
const deleteGroup = require("../controllers/groups/deleteGroup");
const demoteModerator = require('../controllers/groups/demoteModerator');
const getChatMessages = require('../controllers/groups/getChatMessages');
const getGroupChats = require('../controllers/groups/getGroupChats');
const getGroupHome = require('../controllers/groups/getGroupHome');
const getGroupName = require('../controllers/groups/getGroupName');
const getMembers = require("../controllers/groups/getMembers");
const getUsersGroups = require('../controllers/groups/getUsersGroups');
const groupInvite = require('../controllers/groups/groupInvite');
const joinGroup = require('../controllers/groups/joinGroup');
const kickMember = require('../controllers/groups/kickMember');
const leaveGroup = require('../controllers/groups/leaveGroup');
const promoteMember = require('../controllers/groups/promoteMember');
const {
    changeAnnouncementValidator, createChatMessageValidator, createGroupValidator
} = require('../middleware/groupValidation');
const uploadFiles = require("../middleware/uploadFiles");

router.put("/change-announcement", changeAnnouncementValidator, changeAnnouncement);
router.post("/send-message", createChatMessageValidator, createChatMessage);
router.post("/create-group", uploadFiles.single('groupPicture'), createGroupValidator, createGroup);
router.post("/delete-group", deleteGroup);
router.post('/demote-moderator', demoteModerator);
router.get("/get-messages/:userId/:groupId", getChatMessages);
router.get("/get-chats/:userId", getGroupChats);
router.get("/home/:userId/:groupId", getGroupHome);
router.get("/get-group-name/:userId/:groupId", getGroupName);
router.get("/members/:userId/:groupId", getMembers);
router.get("/users-groups/:userId", getUsersGroups);
router.post("/invite", groupInvite);
router.post("/join", joinGroup);
router.post('/kick-member', kickMember);
router.post("/leave-group", leaveGroup);
router.post('/promote-member', promoteMember);

module.exports = router;