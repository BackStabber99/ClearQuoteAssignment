const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
			param: errors.array()[0].param,
		});
	}

	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				err: "NOT able to save user in DB",
			});
		}
		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			phoneNumber: user.phoneNumber,
		});
	});
};

exports.login = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
			param: errors.array()[0].param,
		});
	}

	const { email, password } = req.body;

	User.findOne({ email }, (err, user) => {
		if (err) {
			return res.status(400).json({
				error: "DB Error",
			});
		}

		if (!user) {
			return res.status(400).json({
				error: "User email not found",
			});
		}

		//checking for password from DB
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "Email and Password do not match",
			});
		}

		//Signin the user by
		//Create the token put it in Cookie

		//Creating Token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
		//Put Token in Cookie
		res.cookie("token", token, { expire: new Date() + 9999 });

		//sending response to frontEnd
		const { _id, name, email } = user;
		return res.status(200).json({
			token,
			user: { _id, name, email },
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User Signout Successful",
	});
};

//Protected Routes
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["HS256"],
});

//custom MiddleWares
//req.profile is set up by getUserById controller
exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;

	if (!checker) {
		return res.status(403).json({
			error: "Access Denied",
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "Not Admin",
		});
	}
	next();
};
