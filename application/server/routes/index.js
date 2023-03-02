/* This file handles the routing for the index controllers. */

const express = require("express");
const router = express.Router();
const sendContactUsEmail = require('../controllers/index/sendContactUsEmail');

router.post("/contact-us", sendContactUsEmail);

module.exports = router;