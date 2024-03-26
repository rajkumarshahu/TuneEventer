const express = require("express");
const path = require("path");
const colors = require("colors");
const crypto = require("crypto");
const dotenv = require("dotenv");
const session = require("express-session");

const corsMiddleware = require("./src/middlewares/cors.js");
const loggerMiddleware = require("./src/middlewares/logger.js");
const sessionMiddleware = require("./src/middlewares/session.js");

const SpotifyService = require("./src/api/spotify/SpotifyService.js");
const TicketmasterService = require("./src/api/ticketmaster/TicketmasterService.js");
const DatabaseService = require("./src/api/database/DatabaseService.js");
const ApiServiceProxy = require("./src/patterns/proxy/ApiServiceProxy.js");

const EventFactory = require("./src/patterns/factory/EventFactory");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
DatabaseService();

// Route files
const users = require("./src/routes/users.route.js");
const events = require("./src/routes/events.route.js");
const authRoutes = require("./src/routes/spotifyAuth.route.js");
const ticketmasterRoutes = require("./src/routes/ticketmaster.route.js");
// const spotifyRoutes = require("./src/routes/spotify.route.js");

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(sessionMiddleware);

// Body parser
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize services
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

// Endpoint for factory events
app.get("/factory/check", async (req, res) => {
	// Example usage
	const concertData = {
		type: "Concert",
		name: "Rocking the Arena",
		date: "2023-09-12",
		venue: "The Grand Arena",
		artist: "The Rockers",
		genre: "Rock",
	};

	const festivalData = {
		type: "Festival",
		name: "Summer Sounds Festival",
		date: "2023-08-05",
		venue: "Beachside Park",
		lineup: ["DJ Beat", "The Groovers", "Melody Queens"],
	};

	try {
		const concert = EventFactory.createEvent(concertData);
		console.log(concert.getDescription()); // Output description of the concert
		console.log(concert.getArtistLineup()); // Output the artist performing

		const festival = EventFactory.createEvent(festivalData);
		console.log(festival.getDescription()); // Output description of the festival
		console.log(festival.getFestivalLineup()); // Output the festival lineup
	} catch (error) {
		console.error(error.message);
	}
});

// Endpoint to get user data
app.get("/spotify/user", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}
	try {
		// Use apiServiceProxy instead of spotifyService directly
		const userData = await apiServiceProxy.fetchSpotifyData("me", {
			accessToken: req.session.accessToken,
		});
		res.json(userData);
	} catch (error) {
		console.error("Failed to fetch user data:", error);
		res.status(500).send("Failed to fetch user data");
	}
});

// Endpoint to get the current user's playlists
app.get("/spotify/playlists", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}

	try {
		// Use ApiServiceProxy to fetch Spotify data
		const playlists = await apiServiceProxy.fetchSpotifyData("me/playlists", {
			accessToken: req.session.accessToken,
		});
		res.json(playlists);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Failed to fetch user playlists");
	}
});

app.get("/spotify/top-artists", async (req, res) => {
	//console.log("req: ");
	//console.log(req.session.accessToken);
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}

	try {
		// Utilizing ApiServiceProxy to fetch Spotify data
		const topArtists = await apiServiceProxy.fetchSpotifyData(
			"me/top/artists",
			req.session.accessToken
		);
		res.json(topArtists);
	} catch (error) {
		//console.error("API Error:", error);
		res.status(500).send("Failed to fetch top artists");
	}
});

// Mount routers
app.use("/users", users);
app.use("/events", events);
app.use("/auth", authRoutes);
app.use("/ticketmaster", ticketmasterRoutes);
// app.use("/spotify", spotifyRoutes);

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
