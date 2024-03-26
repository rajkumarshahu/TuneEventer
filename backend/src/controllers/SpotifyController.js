const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const SpotifyService = require("../api/spotify/SpotifyService.js");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

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
