var express = require("express");
var router = express.Router();

const {
	getUserById,
	getUserDetails,
	updateUser,
	removeUser,
	getAllUsers,
	getOtherUserById,
} = require("../controllers/user");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//parameter extractor

//personal ID for auth
router.param("userId", getUserById);
//
router.param("otherUserId", getOtherUserById);

router.get(
	"/getUserDetails/:userId/:otherUserId",
	isSignedIn,
	isAuthenticated,
	getUserDetails
);

router.get("/getAllUsers", getAllUsers);

//req.body should contain name email phoneNumber
router.put("/updateUser/:userId", isSignedIn, isAuthenticated, updateUser);

router.delete("/removeUser/:userId", isSignedIn, isAuthenticated, removeUser);

module.exports = router;
