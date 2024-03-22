const express = require("express");
const path = require("path");
const colors = require("colors");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
app.use(
	cors({
		origin: "http://localhost:3001",
	})
);

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
app.get("/ticketmaster/events/:artistName", async (req, res) => {
	try {
		const { artistName } = req.params;
		const events = await ticketmasterService.fetchEvents(artistName);
		res.json(events);
	} catch (error) {
		console.error(colors.red(`Error: ${error.message}`));
		res.status(500).send("Server Error");
	}
});

// Redirect users to Spotify for login
app.get("/login", (req, res) => {
	const scopes = [
		"user-read-private",
		"user-read-email",
		"user-top-read",
		"user-library-read",
		"playlist-read-private",
	];
	res.redirect(spotifyService.createAuthUrl(scopes));
});

// Handle callback from Spotify
app.get("/callback", async (req, res) => {
	try {
		const { code } = req.query;
		const data = await spotifyService.exchangeCodeForToken(code);
		req.session.accessToken = data.access_token;
		req.session.refreshToken = data.refresh_token;
		req.session.expiresIn = data.expires_in;

		res.redirect(`http://localhost:3000/?access_token=${data.access_token}`);
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred");
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

// Endpoint to get user data
app.get("/spotify/user", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}
	try {
		const userData = await spotifyService.getUserData(req.session.accessToken);
		res.json(userData);
	} catch (error) {
		console.error(error);
		res.status(500).send("Failed to fetch user data");
	}
});

// Endpoint to get the current user's playlists
app.get("/spotify/playlists", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const playlists = await spotifyService.getUserPlaylists(
			req.session.accessToken
		);
		res.json(playlists);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Failed to fetch user playlists");
	}
});

app.get("/spotify/top-artists", async (req, res) => {
	if (!req.session.accessToken) {
		return res.status(401).send("Not authenticated");
	}

	try {
		const topArtists = await spotifyService.getUserTopArtists(
			req.session.accessToken
		);
		res.json(topArtists);
	} catch (error) {
		console.error("API Error:", error);
		res.status(500).send("Failed to fetch top artists");
	}
});

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
