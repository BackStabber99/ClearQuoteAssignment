var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const {
	signout,
	signup,
	login,
	isSignedIn,
	isAuthenticated,
} = require("../controllers/auth");

//SIGNUP route
//req.body must contain name email phoneNumber password
router.post(
	"/signup",
	[
		check("name")
			.isLength({ min: 3 })
			.withMessage("Name should be Min 3 characters"),
		check("email").isEmail().withMessage("Email is Required"),
		check("password")
			.isLength({ min: 5, max: 15 })
			.withMessage("Password should be 5 Character long"),
		check("phoneNumber")
			.isLength(10)
			.withMessage("Valid Phone Number required"),
	],
	signup
);

//LOGIN route
//req.body must contain email and password
router.post(
	"/login",
	[
		check("email").isEmail().withMessage("Email is Required"),
		check("password")
			.isLength({ min: 5, max: 15 })
			.withMessage("Password is Required"),
	],
	login
);

router.get("/signout", signout);

module.exports = router;
