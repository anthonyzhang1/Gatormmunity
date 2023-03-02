/* This file handles the routing for the thread controllers. */

const express = require("express");
const router = express.Router();
const createThread = require("../controllers/threads/createThread");
const deletePost = require("../controllers/threads/deletePost");
const deleteThread = require("../controllers/threads/deleteThread");
const getThreads = require("../controllers/threads/getThreads");
const makePost = require("../controllers/threads/makePost");
const search = require("../controllers/threads/search");
const viewThread = require("../controllers/threads/viewThread");
const { createThreadValidator, makePostValidator, searchValidator } = require('../middleware/threadValidation');
const uploadFiles = require("../middleware/uploadFiles");

router.post("/create-thread", uploadFiles.single('threadImage'), createThreadValidator, createThread);
router.post('/delete-post', deletePost);
router.post('/delete-thread', deleteThread);
router.post("/get-threads", getThreads);
router.post("/make-post", makePostValidator, makePost);
router.post("/search", searchValidator, search);
router.post("/view-thread", viewThread);

module.exports = router;