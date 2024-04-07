const UserModel = require("../models/UserModel");

// @desc      Get all users
// @route     GET /users
// @access    Private
exports.getUsers = async (req, res, next) => {
	try {
		const users = await UserModel.find();
		res.status(200).json({ success: true, count: users.length, data: users });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc      Get single user
// @route     GET /users/:id
// @access    Private
exports.getUser = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.params.id);
		if (!user) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({ success: true, data: user });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc      Save user
// @route     POST /users
// @access    Private
exports.saveUser = async (req, res, next) => {
	try {
		const user = await UserModel.create(req.body);
		res.status(201).json({
			success: true,
			data: user,
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

// @desc      Delete user
// @route     DELETE /users/:id
// @access    Private
exports.deleteUser = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.params.id);
		await user.deleteOne();
		if (!user) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({ success: true, data: {} });
	} catch (error) {}
};
