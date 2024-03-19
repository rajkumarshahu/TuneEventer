const express = require("express");
const path = require("path");
const colors = require("colors");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const cors = require("cors");
const querystring = require("querystring");

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

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			collectionName: "sessions",
		}),
		cookie: {
			secure: process.env.NODE_ENV === "production",
			maxAge: 1000 * 60 * 60 * 24,
		},
	})
);

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

app.get("/login", (req, res) => {
	const state = crypto.randomBytes(16).toString("hex");
	const scope =
		"user-read-private user-read-email user-top-read user-library-read";
	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			querystring.stringify({
				response_type: "code",
				client_id: process.env.SPOTIFY_CLIENT_ID,
				scope: scope,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
				state: state,
			})
	);
});

app.get("/callback", async (req, res) => {
	const code = req.query.code || null;

	try {
		const data = await spotifyService.exchangeCodeForToken(code);

		req.session.accessToken = data.access_token;
		res.redirect("frontend/index.html");
	} catch (error) {
		console.error("Callback Error:", error);
		res.status(500).send("Internal Server Error");
	}
});

// Route to generate and display the Spotify authorization link
app.get("/auth-link", (req, res) => {
	const state = crypto.randomBytes(16).toString("hex");
	const scopes = [
		"user-read-private",
		"user-read-email",
		"user-top-read",
		"user-library-read",
	];
	const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI);

	const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
		process.env.SPOTIFY_CLIENT_ID
	}&scope=${encodeURIComponent(
		scopes.join(" ")
	)}&redirect_uri=${redirectUri}&state=${state}`;

	res.send(`Click <a href="${authorizationUrl}">here</a> to authorize.`);
});

app.get("/api/spotify/user", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const userData = await spotifyService.getUserData(req.session.accessToken);
		res.json(userData);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Internal Server Error");
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
