const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const SpotifyService = require("../api/spotify/SpotifyService.js");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");

// Creating instances of the SpotifyService and TicketmasterService
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();

// Instantiating the ApiServiceProxy with the Spotify and Ticketmaster services
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

/**
 * Fetches the current user's Spotify data.
 * This endpoint requires that the user is authenticated and has a valid session with an access token.
 */
exports.getUserData = async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}
	try {
		const userData = await apiServiceProxy.fetchSpotifyData(
			"me",
			req.session.accessToken
		);
		res.json(userData);
	} catch (error) {
		console.error("Failed to fetch user data:", error);
		res.status(500).send("Failed to fetch user data");
	}
};

/**
 * Fetches the current user's Spotify playlists.
 * This endpoint also requires that the user is authenticated with a valid session.
 */
exports.getUserPlaylists = async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}
	try {
		const playlists = await apiServiceProxy.fetchSpotifyData(
			"me/playlists",
			req.session.accessToken
		);
		res.json(playlists);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Failed to fetch user playlists");
	}
};

/**
 * Fetches the current user's top artists from Spotify.
 * As with the other endpoints, a valid session with an access token is required.
 */
exports.getTopArtists = async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}
	try {
		const topArtists = await apiServiceProxy.fetchSpotifyData(
			"me/top/artists",
			req.session.accessToken
		);
		res.json(topArtists);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Failed to fetch top artists");
	}
};
