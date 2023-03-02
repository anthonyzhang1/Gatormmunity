const express = require("express");
const router = express.Router();
const uploadFiles = require("../middleware/uploadFiles");
const threadController = require("../controllers/threads");
const { createThreadValidator, makePostValidator, searchValidator } = require('../middleware/threadValidation');

router.post("/search", searchValidator, threadController.search);

router.post("/create-thread", uploadFiles.single('threadImage'), createThreadValidator, threadController.createThread);

router.post("/view-thread", threadController.viewThread);

router.post('/delete-thread', threadController.deleteThread);

router.post('/delete-post', threadController.deletePost);

router.post("/make-post", makePostValidator, threadController.makePost);

router.post("/get-threads", threadController.getThreads);

module.exports = router;