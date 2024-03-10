const express = require("express");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./src/api/database/DatabaseService.js");
const cors = require("cors");

const SpotifyService = new require("./src/api/spotify/SpotifyService.js");
const TicketmasterService = new require(
	"./src/api/ticketmaster/TicketmasterService"
);
const DatabaseService = new require("./src/api/database/DatabaseService");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
		return res.status(200).json({});
	}
	next();
});

// Logs request to console
const logger = (req, res, next) => {
	console.log(
		`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
	);
	next();
};

app.use(logger);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const spotifyService = new SpotifyService();
const ticketmasterService = new TicketmasterService();
// const databaseService = new DatabaseService();

// Routes
app.get("/api/events/:artistName", async (req, res) => {
	const { artistName } = req.params;
	const events = await ticketmasterService.fetchEvents(artistName);
	res.json(events);
});

const PORT = process.env.PORT || 3000;

const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
