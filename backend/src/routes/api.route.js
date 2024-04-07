const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const EventModel = require("../models/EventModel");

const SpotifyService = require("../api/spotify/SpotifyService");
const spotifyService = new SpotifyService();

const {
	GenreFilter,
	DateFilter,
} = require("../patterns/chainOfResponsibility/EventFilterChain");

// Endpoint to fetch user profile
router.get("/profile", async (req, res) => {
	try {
		const user_data = await spotifyService.getUserData(req.session.accessToken);
		let user = await UserModel.findOne({ spotifyId: user_data.id });
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.json(user);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).send("Error fetching user profile");
	}
});

router.get("/events", async (req, res) => {
	console.log("Query parameters received:", req.query);
	try {
		const query = {}; // MongoDB query object
		console.log("Initial query:", query);

		const request = {
			genre: req.query.genre,
			fromDate: req.query.fromDate,
			toDate: req.query.toDate,
		};
		console.log("Request parameters:", request);

		// Setting up the chain
		const genreFilter = new GenreFilter();
		const dateFilter = new DateFilter();
		genreFilter.setNext(dateFilter);

		// Processing the chain
		genreFilter.handle(query, request);
		console.log("Processed query:", query);

		// Use the query object for database lookup
		const events = await EventModel.find(query);
		console.log("Found events:", events.length);
		res.json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).send("Error fetching events");
	}
});

// Endpoint to fetch unique genres
router.get("/genres", async (req, res) => {
	try {
		const genres = await EventModel.distinct("genre");
		res.json(genres.filter((genre) => genre));
	} catch (error) {
		console.error("Error fetching genres:", error);
		res.status(500).send("Error fetching genres");
	}
});

// Endpoint to fetch unique Spotify artists
router.get("/spotify-artists", async (req, res) => {
	try {
		const spotifyArtists = await EventModel.distinct("spotifyArtists");
		// Filter out any falsy values (e.g., empty strings, null) to ensure only valid artist names are returned
		res.json(spotifyArtists.filter((artist) => artist));
	} catch (error) {
		console.error("Error fetching Spotify artists:", error);
		res.status(500).send("Error fetching Spotify artists");
	}
});

module.exports = router;
