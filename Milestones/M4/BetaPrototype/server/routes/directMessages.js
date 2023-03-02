const express = require("express");
const router = express.Router();
const directMessageController = require("../controllers/directMessages");
const { createDirectMessageValidator } = require('../middleware/directMessageValidation');

router.get("/get-conversations/:userId", directMessageController.getConversations);

router.get("/get-messages/:conversationId", directMessageController.getNDirectMessages);

router.post('/send-message', createDirectMessageValidator, directMessageController.createDirectMessage);

router.post("/create-conversation", directMessageController.createConversation);

module.exports = router;