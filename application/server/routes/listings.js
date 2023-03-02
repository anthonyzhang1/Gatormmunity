/* This file handles the routing for the listing controllers. */

const express = require("express");
const router = express.Router();
const createListing = require("../controllers/listings/createListing");
const deleteListing = require("../controllers/listings/deleteListing");
const getListings = require("../controllers/listings/getListings");
const search = require("../controllers/listings/search");
const viewListing = require("../controllers/listings/viewListing");
const { createListingValidator, searchValidator, getListingsValidator } = require('../middleware/listingValidation');
const uploadFiles = require("../middleware/uploadFiles");

router.post("/create-listing", uploadFiles.single('itemPhoto'), createListingValidator, createListing);
router.post("/delete-listing", deleteListing);
router.post("/get-listings", getListingsValidator, getListings);
router.post("/search", searchValidator, search);
router.get("/view/:listingId", viewListing);

module.exports = router;