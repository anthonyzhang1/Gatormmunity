const express = require("express");
const router = express.Router();
const uploadFiles = require("../middleware/uploadFiles");
const userController = require("../controllers/users");
const { registrationValidator, profilePictureValidator } = require("../middleware/userValidation");

// Apply multer to the FormData object we receive, so that Express can access `req.body`
router.use("/register", uploadFiles.fields([
    { name: "sfsu_id_picture", maxCount: 1 }
]));
router.post("/register", registrationValidator, userController.user_register);

router.post("/login", userController.user_login);

router.get("/check-if-authenticated", userController.user_authenticate);

router.get("/logout", userController.user_logout);

router.post("/search", userController.user_search);

router.post("/contact-us", userController.user_contact_us);

router.use("/change-profile-picture", uploadFiles.fields([
    { name: "profilePicture", maxCount: 1 }
]));
router.post("/change-profile-picture", profilePictureValidator, userController.change_profile_picture);

module.exports = router;