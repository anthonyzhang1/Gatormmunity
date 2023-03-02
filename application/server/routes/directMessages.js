/* This file handles the routing for the direct message controllers. */

const express = require("express");
const router = express.Router();
const createConversation = require('../controllers/directMessages/createConversation');
const createDirectMessage = require('../controllers/directMessages/createDirectMessage');
const getConversations = require('../controllers/directMessages/getConversations');
const getDirectMessages = require('../controllers/directMessages/getDirectMessages');
const { createDirectMessageValidator } = require('../middleware/directMessageValidation');

router.post("/create-conversation", createConversation);
router.post('/send-message', createDirectMessageValidator, createDirectMessage);
router.get("/get-conversations/:userId", getConversations);
router.get("/get-messages/:conversationId", getDirectMessages);

module.exports = router;