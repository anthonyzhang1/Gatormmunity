const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings");
const uploadFiles = require("../middleware/uploadFiles");
const { createListingValidator, searchValidator, getListingsValidator } = require('../middleware/listingValidation');

router.post("/create-listing", uploadFiles.single('itemPhoto'), createListingValidator, listingController.createListing);

router.post("/get-listings", getListingsValidator, listingController.getListings);

router.get("/view/:listingId", listingController.viewListing);

router.post("/delete-listing", listingController.deleteListing)

router.post("/search", searchValidator, listingController.search);

module.exports = router;