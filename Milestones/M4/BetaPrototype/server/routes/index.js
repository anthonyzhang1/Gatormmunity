const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

router.post("/contact-us", indexController.contactUs);

module.exports = router;