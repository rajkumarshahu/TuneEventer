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

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
DatabaseService();

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(sessionMiddleware);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize services
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

// API route for fetching events
app.get("/ticketmaster/events/:artistName", async (req, res) => {
	try {
		const { artistName } = req.params;

		const events = await apiServiceProxy.fetchTicketmasterData(artistName);
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

		console.log("Received token data:", data);
		req.session.accessToken = data.access_token;
		console.log("Session after setting token:", req.session);

		req.session.refreshToken = data.refresh_token;
		req.session.expiresIn = data.expires_in;

		req.session.accessToken = data.access_token;
		req.session.save((err) => {
			if (err) {
				console.error("Session save error:", err);
			} else {
				console.log("Session saved successfully with accessToken");
			}
		});

		res.redirect(`http://localhost:3000/?access_token=${data.access_token}`);
	} catch (error) {
		console.error(error);
		top - artists;
		res.status(500).send("An error occurred");
	}
});

app.get("/api/session", (req, res) => {
	//console.log("SSSSSSSSS:", req.session.accessToken);
	if (req.session.accessToken) {
		res.json({ isAuthenticated: true, accessToken: req.session.accessToken });
	} else {
		res.json({ isAuthenticated: false });
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

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
