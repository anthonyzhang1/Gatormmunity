const express = require("express");
const router = express.Router();
const uploadFiles = require("../middleware/uploadFiles");
const userController = require("../controllers/users");
const { registrationValidator, profilePictureValidator, searchValidator } = require("../middleware/userValidation");

router.post("/register", uploadFiles.single('sfsu_id_picture'), registrationValidator, userController.register);

router.post("/login", userController.login);

router.get("/check-if-authenticated", userController.checkIfAuthenticated);

router.get('/dashboard/:userId', userController.getDashboard);

router.get("/logout", userController.logout);

router.post("/search", searchValidator, userController.search);

router.get("/profile/:userId", userController.getProfile);

router.post("/change-profile-picture", uploadFiles.single('profilePicture'), profilePictureValidator,
            userController.changeProfilePicture);

router.get('/approval-requests', userController.getApprovalRequests);

router.post('/approve-user', userController.approveUser);

router.post('/reject-user', userController.rejectUser);

router.post('/ban-user', userController.banUser);

router.post('/appoint-moderator', userController.appointModerator);

router.post('/unappoint-moderator', userController.unappointModerator);

module.exports = router;