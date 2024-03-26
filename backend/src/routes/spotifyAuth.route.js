const express = require("express");
const {
	login,
	callback,
	getSession,
	getAuthLink,
} = require("../controllers/SpotifyAuthController");

const router = express.Router();

router.get("/login", login);
router.get("/callback", callback);
router.get("/session", getSession);
router.get("/auth-link", getAuthLink);

module.exports = router;
