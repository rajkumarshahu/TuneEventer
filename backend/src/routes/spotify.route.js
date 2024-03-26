const express = require("express");
const {
	getUserData,
	getUserPlaylists,
	getTopArtists,
} = require("../controllers/SpotifyAuthController.js");

const router = express.Router();

router.get("/user", getUserData);
router.get("/playlists", getUserPlaylists);
router.get("/top-artists", getTopArtists);

module.exports = router;
