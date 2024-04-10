const SpotifyService = require("../api/spotify/SpotifyService");

// Instantiate SpotifyService to interact with the Spotify API
const spotifyService = new SpotifyService();
const UserModel = require("../models/UserModel");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");

// Instantiate TicketmasterService to interact with the Ticketmaster API
const ticketMasterService = new TicketmasterService();

const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const EventFactory = require("../patterns/factory/EventFactory.js");

// ApiServiceProxy is used to delegate API calls to Spotify and Ticketmaster services
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

/**
 * Utility function to determine a valid date for an event.
 * If the event data contains a dateTime, it uses that; otherwise, it falls back to localDate.
 * If neither is available, it logs a message and returns the current date.
 * @param {Object} eventData - The data object containing event date information.
 * @returns {Date} - A JavaScript Date object for the event.
 */
function getValidDate(eventData) {
	if (eventData.dates.start.dateTime) {
		return new Date(eventData.dates.start.dateTime);
	} else if (eventData.dates.start.localDate) {
		return new Date(eventData.dates.start.localDate);
	} else {
		console.log("Fallback to current date for event:", eventData.name);
		return new Date();
	}
}

/**
 * Processes user's top genres from Spotify and fetches matching events from Ticketmaster.
 * Utilizes user's top artists to determine favorite genres and fetches events that match these genres and user's location.
 * @param {Array} topArtists - User's top artists from Spotify.
 * @param {String} userCountry - User's country code.
 */
async function processUserTopGenresAndFetchEvents(topArtists, userCountry) {
	// Extract all genres from the user's top artists using flatMap, resulting in a single array of genres
	const genres = topArtists.items.flatMap((artist) => artist.genres);

	// Count occurrences of each genre in the array to identify the user's favorite genres
	const genreCounts = genres.reduce((counts, genre) => {
		counts[genre] = (counts[genre] || 0) + 1; // Increment the count for each occurrence of a genre
		return counts;
	}, {});

	// Convert the genreCounts object into an array of [genre, count] pairs and sort them by count in descending order
	const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);

	// Select the top 5 genres based on their counts
	const top5Genres = sortedGenres.slice(0, 5).map((genre) => genre[0]);

	// Fetch event data from Ticketmaster based on the user's top 5 genres and country
	// This utilizes the TicketmasterService to find events that match the user's music preferences
	const eventsData = await ticketMasterService.fetchEventsByGenreAndCountry(
		top5Genres,
		userCountry
	);

	// For each fetched event, create an event object using the EventFactory and save it
	for (const eventData of eventsData) {
		// Determine event type based on classifications
		let eventType =
			eventData.classifications[0].segment.name === "Music" &&
			eventData.classifications[0].genre.name.toLowerCase().includes("festival")
				? "Festival"
				: "Concert";

		let eventFactory = EventFactory.createEvent({
			type: eventType,
			date: getValidDate(eventData),
			name: eventData.name,
			genre: eventData.classifications[0].genre.name,
			artist: eventData.classifications[0].genre.name,
			lineup: eventData.classifications[0].genre.name,
			location: eventData._embedded.venues[0].name,
			url: eventData.url,
			imageUrl: eventData.images[0].url,
			venue: {
				name: eventData._embedded.venues[0].name,
				address: eventData._embedded.venues[0].address.line1,
				city: eventData._embedded.venues[0].city.name,
				state: eventData._embedded.venues[0].state.stateCode,
				postalCode: eventData._embedded.venues[0].postalCode,
				country: eventData._embedded.venues[0].country.countryCode,
			},
			spotifyArtists: topArtists.items.map((artist) => artist.name),
		});
		eventFactory.saveEvent();
	}
}

/**
 * Initiates the Spotify login process. Redirects the user to Spotify's authorization page
 * with the required scopes to grant permissions to the application.
 */
exports.login = (req, res) => {
	const scopes = [
		"user-read-private",
		"user-read-email",
		"user-top-read",
		"user-library-read",
		"playlist-read-private",
	];
	res.redirect(spotifyService.createAuthUrl(scopes));
};

/**
 * Handles the OAuth callback from Spotify. This function is called after the user
 * authenticates with Spotify and grants permissions. It exchanges the authorization code
 * for an access token and refresh token, fetches the user's data, and saves it in the session.
 */
exports.callback = async (req, res) => {
	try {
		const { code } = req.query;
		const data = await spotifyService.exchangeCodeForToken(code);
		const user_data = await spotifyService.getUserData(data.access_token);

		console.log("user_data:", user_data.country);

		let userCountry = user_data.country || "US";

		let user = await UserModel.findOne({ spotifyId: user_data.id });
		if (user) {
			user.email = user_data.email;
			user.displayName = user_data.display_name;
			user.profileUrl = user_data.external_urls.spotify;
			user.accessToken = data.access_token;
			user.refreshToken = data.refresh_token;
		} else {
			user = new UserModel({
				spotifyId: user_data.id,
				email: user_data.email,
				displayName: user_data.display_name,
				profileUrl: user_data.external_urls.spotify,
				accessToken: data.access_token,
				refreshToken: data.refresh_token,
			});
		}
		await user.save();

		// Process to fetch and categorize user's top genres from Spotify and then fetch matching events from Ticketmaster
		const topArtists = await apiServiceProxy.fetchSpotifyData(
			"me/top/artists",
			data.access_token
		);

		await processUserTopGenresAndFetchEvents(topArtists, userCountry);

		// Update the user's session with the new access and refresh tokens
		req.session.accessToken = data.access_token;
		req.session.refreshToken = data.refresh_token;
		req.session.expiresIn = data.expires_in;
		req.session.save((err) => {
			if (err) {
				console.error("Session save error:", err);
				return res.status(500).send("Error saving the session");
			}
			res.redirect(`http://localhost:3000/home`);
		});
	} catch (error) {
		console.error("An error occurred during the callback:", error);
		if (!res.headersSent) {
			res.status(500).send("An error occurred during the callback");
		}
	}
};

/**
 * Checks if the user's session has a valid access token and returns the authentication status.
 * This function helps the frontend to determine if the user is logged in and authorized.
 */
exports.getSession = (req, res) => {
	if (req.session.accessToken) {
		res.json({ isAuthenticated: true, accessToken: req.session.accessToken });
	} else {
		res.redirect(`http://localhost:3000/home`);
	}
};

/**
 * Generates a URL for Spotify authorization and sends it back to the client.
 * This function is used to initiate the login process from the frontend.
 */
exports.getAuthLink = (req, res) => {
	const state = crypto.randomBytes(16).toString("hex");
	const scopes = [
		"user-read-private",
		"user-read-email",
		"user-top-read",
		"user-library-read",
	];
	const redirectUri = encodeURIComponent(spotifyService.redirectUri);

	const authorizationUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
		spotifyService.clientId
	}&scope=${encodeURIComponent(
		scopes.join(" ")
	)}&redirect_uri=${redirectUri}&state=${state}&show_dialog=true`;

	res.send(`Click <a href="${authorizationUrl}">here</a to authorize.`);
};
