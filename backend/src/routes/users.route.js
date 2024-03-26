const express = require("express");
const {
	getUsers,
	getUser,
	saveUser,
	deleteUser,
} = require("../controllers/UserController");

const router = express.Router({ mergeParams: true });

router.route("/").get(getUsers).post(saveUser);

router.route("/:id").get(getUser).delete(deleteUser);

module.exports = router;
