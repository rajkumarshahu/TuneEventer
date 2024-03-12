const express = require("express");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");

const SpotifyService = require("./src/api/spotify/SpotifyService.js");
const TicketmasterService = require("./src/api/ticketmaster/TicketmasterService");
const DatabaseService = require("./src/api/database/DatabaseService");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
DatabaseService();

const app = express();

// Middleware for CORS
app.use(cors());

// Middleware for logging requests to the console
app.use((req, res, next) => {
	console.log(colors.cyan(`${req.method} ${req.originalUrl}`));
	next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize services
const spotifyService = new SpotifyService();
const ticketmasterService = new TicketmasterService();

// API route for fetching events
app.get("/api/events/:artistName", async (req, res) => {
	try {
		const { artistName } = req.params;
		const events = await ticketmasterService.fetchEvents(artistName);
		res.json(events);
	} catch (error) {
		console.error(colors.red(`Error: ${error.message}`));
		res.status(500).send("Server Error");
	}
});

const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
