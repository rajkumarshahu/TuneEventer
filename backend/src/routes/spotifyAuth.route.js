const express = require("express");

/**
 * Import controller functions from SpotifyAuthController
 * - login: Function to handle the login process
 * - callback: Function to handle the callback after Spotify authentication
 * - getSession: Function to retrieve session information
 * - getAuthLink: Function to provide an authentication link for Spotify
 */
const {
	login,
	callback,
	getSession,
	getAuthLink,
} = require("../controllers/SpotifyAuthController");

const router = express.Router();

/**
 * Route to initiate the Spotify login process
 * When a GET request is made to '/login',
 * the 'login' controller function is invoked
 */
router.get("/login", login);

/**
 * Route for handling the callback from Spotify after authentication
 * When a GET request is made to '/callback',
 * the 'callback' controller function is invoked
 */
router.get("/callback", callback);

/**
 * Route to retrieve current session information
 * When a GET request is made to '/session',
 * the 'getSession' controller function is invoked
 */
router.get("/session", getSession);

/**
 * Route to provide an authentication link for Spotify
 * When a GET request is made to '/auth-link',
 * the 'getAuthLink' controller function is invoked
 */
router.get("/auth-link", getAuthLink);

module.exports = router;
