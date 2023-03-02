const express = require("express");
const router = express.Router();
const uploadFiles = require("../middleware/uploadFiles");
const groupController = require("../controllers/groups");
const {
    changeAnnouncementValidator, createChatMessageValidator, createGroupValidator
} = require('../middleware/groupValidation');

router.post("/create-group", uploadFiles.single('groupPicture'), createGroupValidator, groupController.createGroup);

router.get("/home/:userId/:groupId", groupController.getGroupHome);

router.post("/invite", groupController.groupInvite);

router.get("/get-create-thread/:userId/:groupId", groupController.getCreateThread)

router.get("/users-groups/:userId", groupController.getUsersGroups);

router.post("/join", groupController.joinGroup);

router.post('/kick-member', groupController.kickMember);

router.post('/promote-member', groupController.promoteMember);

router.post('/demote-moderator', groupController.demoteModerator);

router.post("/leave-group", groupController.leaveGroup);

router.post("/delete-group", groupController.deleteGroup);

router.get("/members/:userId/:groupId", groupController.getMembers);

router.put("/change-announcement", changeAnnouncementValidator, groupController.changeAnnouncement);

router.get("/get-chats/:userId", groupController.getGroupChats);

router.get("/get-messages/:userId/:groupId", groupController.getNChatMessages);

router.post("/send-message", createChatMessageValidator, groupController.createChatMessage);

module.exports = router;