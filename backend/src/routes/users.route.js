const express = require("express");
const { isAuthenticated } = require("../middlewares/authenticate");
const {
	getUsers,
	getUser,
	saveUser,
	deleteUser,
} = require("../controllers/UserController");

const router = express.Router({ mergeParams: true });

// Applying middleware to protect all routes in this router
// router.use(isAuthenticated);

// Only authenticated users can access these routes
router.route("/").get(getUsers).post(saveUser);
router.route("/:id").get(getUser).delete(deleteUser);

module.exports = router;
