const User = require("../models/user");

exports.getUserById = (req, res, next, id) => {
	User.findById(id, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User Not found in DB",
			});
		}
		req.profile = user;
		next();
	});
};

exports.getOtherUserById = (req, res, next, id) => {
	User.findById(id, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User Not found in DB",
			});
		}
		req.otherProfile = user;
		next();
	});
};

//for user to get his details
exports.getUserDetails = (req, res) => {
	req.otherProfile.salt = undefined;
	req.otherProfile.encry_password = undefined;
	req.otherProfile.createdAt = undefined;
	req.otherProfile.updatedAt = undefined;

	return res.json(req.otherProfile);
};

//for users to update their detail
exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body }, //req.body will have values from frontend to be updated
		{ new: true, useFindAndModify: false },
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Not authorized to update a user",
				});
			}
			user.salt = undefined;
			user.encry_password = undefined;
			user.createdAt = undefined;
			user.updatedAt = undefined;
			res.status(200).json(user);
		}
	);
};

exports.getAllUsers = (req, res) => {
	User.find({})
		.select(["-createdAt", "-updatedAt", "-salt", "-encry_password"])
		.exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "User not found / DB error",
				});
			}
			return res.json(user);
		});
};

exports.removeUser = (req, res) => {
	User.findByIdAndDelete(req.profile._id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found / DB error",
			});
		}
		return res.json({
			message: "User remove successfully",
			user,
		});
	});
};
