const express = require("express");

/**
 * Import specific controller functions from SpotifyAuthController
 * - getUserData: Retrieves the current user's Spotify data
 * - getUserPlaylists: Fetches playlists for the current Spotify user
 * - getTopArtists: Retrieves the current user's top artists from Spotify
 */
const {
	getUserData,
	getUserPlaylists,
	getTopArtists,
} = require("../controllers/SpotifyAuthController.js");

const router = express.Router();

/**
 * Define a GET route '/user' to obtain user data
 * When a GET request is made to '/user',
 * the getUserData controller function is executed
 */
router.get("/user", getUserData);

/**
 * Define a GET route '/playlists' to fetch the user's playlists
 * When a GET request is made to '/playlists',
 * the getUserPlaylists controller function is executed
 */
router.get("/playlists", getUserPlaylists);

/**
 * Define a GET route '/top-artists' to obtain the user's top artists
 * When a GET request is made to '/top-artists',
 * the getTopArtists controller function is executed
 */
router.get("/top-artists", getTopArtists);

module.exports = router;
