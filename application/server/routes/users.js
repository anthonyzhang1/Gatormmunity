/* This file handles the routing for the user controllers. */

const express = require("express");
const router = express.Router();
const adminChangePassword = require("../controllers/users/adminChangePassword");
const appointModerator = require("../controllers/users/appointModerator");
const approveUser = require("../controllers/users/approveUser");
const banUser = require("../controllers/users/banUser");
const changeProfilePicture = require("../controllers/users/changeProfilePicture");
const checkIfAuthenticated = require("../controllers/users/checkIfAuthenticated");
const getApprovalRequests = require("../controllers/users/getApprovalRequests");
const getDashboard = require("../controllers/users/getDashboard");
const getProfile = require("../controllers/users/getProfile");
const login = require("../controllers/users/login");
const logout = require("../controllers/users/logout");
const register = require("../controllers/users/register");
const rejectUser = require("../controllers/users/rejectUser");
const search = require("../controllers/users/search");
const unappointModerator = require("../controllers/users/unappointModerator");
const uploadFiles = require("../middleware/uploadFiles");
const {
    changePasswordValidator, registrationValidator, profilePictureValidator, searchValidator
} = require("../middleware/userValidation");

router.post('/admin-change-password', changePasswordValidator, adminChangePassword);
router.post('/appoint-moderator', appointModerator);
router.post('/approve-user', approveUser);
router.post('/ban-user', banUser);
router.post("/change-profile-picture", uploadFiles.single('profilePicture'), profilePictureValidator, changeProfilePicture);
router.get("/check-if-authenticated", checkIfAuthenticated);
router.get('/approval-requests', getApprovalRequests);
router.get('/dashboard/:userId', getDashboard);
router.get("/profile/:userId", getProfile);
router.post("/login", login);
router.get("/logout", logout);
router.post("/register", uploadFiles.single('sfsuIdPicture'), registrationValidator, register);
router.post('/reject-user', rejectUser);
router.post("/search", searchValidator, search);
router.post('/unappoint-moderator', unappointModerator);

module.exports = router;