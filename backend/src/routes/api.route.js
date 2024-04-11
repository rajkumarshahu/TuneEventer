const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");

const { EventModel } = require("../models/EventModel");

const SpotifyService = require("../api/spotify/SpotifyService");

// Instantiate the SpotifyService for use in fetching data from Spotify's API
const spotifyService = new SpotifyService();

const {
	GenreFilter,
	DateFilter,
} = require("../patterns/chainOfResponsibility/EventFilterChain");

/*
 * Define an endpoint to retrieve the Spotify user's profile data.
 * This uses the accessToken stored in the session to request data from Spotify.
 */
router.get("/profile", async (req, res) => {
	try {
		const user_data = await spotifyService.getUserData(req.session.accessToken);
		let user = await UserModel.findOne({ spotifyId: user_data.id });
		if (!user) {
			// If no user is found, respond with a 404 status.
			return res.status(404).send("User not found");
		}
		// Send the found user data back to the client.
		res.json(user);
	} catch (error) {
		// Log any errors and respond with a 500 status.
		console.error("Error fetching user profile:", error);
		res.status(500).send("Error fetching user profile");
	}
});

/*
 * Define an endpoint to retrieve events, filtered by query parameters.
 * This demonstrates the use of the chain of responsibility pattern
 * to process genre and date filters on event queries.
 */
router.get("/events", async (req, res) => {
	try {
		const query = {}; // Initialize MongoDB query object

		const request = {
			genre: req.query.genre,
			fromDate: req.query.fromDate,
			toDate: req.query.toDate,
		};

		// Setup chain of responsibility for filtering
		const genreFilter = new GenreFilter();
		const dateFilter = new DateFilter();
		genreFilter.setNext(dateFilter);

		// Process the query through the filters
		genreFilter.handle(query, request);

		// Fetch and return events based on the processed query
		const events = await EventModel.find(query); // Query all events using the base model

		res.json(events);
	} catch (error) {
		// Log any errors and respond with a 500 status.
		console.error("Error fetching events:", error);
		res.status(500).send("Error fetching events");
	}
});

/*
 * Define an endpoint to retrieve unique genres from the events.
 * This queries the EventModel for distinct genres and filters out any falsy values.
 */
router.get("/genres", async (req, res) => {
	try {
		const genres = await EventModel.distinct("genre");
		res.json(genres.filter((genre) => genre));
	} catch (error) {
		console.error("Error fetching genres:", error);
		res.status(500).send("Error fetching genres");
	}
});

/*
 * Define an endpoint to retrieve unique Spotify artists from the events.
 * This queries the EventModel for distinct Spotify artists
 * and filters out any falsy values.
 */
router.get("/spotify-artists", async (req, res) => {
	try {
		const spotifyArtists = await EventModel.distinct("spotifyArtists");
		res.json(spotifyArtists.filter((artist) => artist));
	} catch (error) {
		// Log any errors and respond with a 500 status.
		console.error("Error fetching Spotify artists:", error);
		res.status(500).send("Error fetching Spotify artists");
	}
});

module.exports = router;
