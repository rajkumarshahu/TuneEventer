const SpotifyService = require("../api/spotify/SpotifyService");
const spotifyService = new SpotifyService();
const UserModel = require("../models/UserModel");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");

const ticketMasterService = new TicketmasterService();
const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const EventFactory = require("../patterns/factory/EventFactory.js");
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

function getValidDate(eventData) {
	if (eventData.dates.start.dateTime) {
		return new Date(eventData.dates.start.dateTime);
	} else if (eventData.dates.start.localDate) {
		// Assuming localDate is in 'YYYY-MM-DD' format; adjust if necessary
		return new Date(eventData.dates.start.localDate);
	} else {
		// Fallback to the current date or another sensible default
		console.log("Fallback to current date for event:", eventData.name);
		return new Date();
	}
}
/* Initiates the Spotify login process by redirecting the user to 
   the Spotify authorization page with the required scopes.*/
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

/*  Handles the OAuth callback after the user has authenticated with Spotify, 
    exchanges the code for an access token,and saves it in the session.*/
exports.callback = async (req, res) => {
	try {
		const { code } = req.query;
		const data = await spotifyService.exchangeCodeForToken(code);
		const user_data = await spotifyService.getUserData(data.access_token);

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

		const topArtists = await apiServiceProxy.fetchSpotifyData(
			"me/top/artists",
			data.access_token
		);
		const genres = topArtists.items.flatMap((artist) => artist.genres);
		const genreCounts = genres.reduce((counts, genre) => {
			counts[genre] = (counts[genre] || 0) + 1;
			return counts;
		}, {});
		const sortedGenres = Object.entries(genreCounts).sort(
			(a, b) => b[1] - a[1]
		);
		const top5Genres = sortedGenres.slice(0, 5).map((genre) => genre[0]);

		const userCountry = user_data.country || "US";

		const eventsData = await ticketMasterService.fetchEventsByGenreAndCountry(
			top5Genres,
			userCountry
		);

		for (const eventData of eventsData) {
			let locationString =
				eventData._embedded?.venues?.[0]?.name ?? "Location not available";

			let venueName =
				eventData._embedded?.venues?.[0]?.name ?? "Venue name not available";
			let address =
				eventData._embedded?.venues?.[0]?.address?.line1 ??
				"Address not available";
			let city =
				eventData._embedded?.venues?.[0]?.city?.name ?? "City not available";
			let state =
				eventData._embedded?.venues?.[0]?.state?.stateCode ??
				"State not available";
			let postalCode =
				eventData._embedded?.venues?.[0]?.postalCode ??
				"Postal code not available";
			let country =
				eventData._embedded?.venues?.[0]?.country?.countryCode ??
				"Country not available";

			let imageUrl =
				eventData.images[0].url ??
				"https://static.wixstatic.com/media/10eae1_c0388d04e92c4e9180533cf98f891a24~mv2.jpg/v1/fill/w_772,h_468,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/B%26W%20Crowd.jpg";

			let eventType = "unknown";
			let festival_lineup = "";
			let concert_genre = "";
			let concert_artist = "";
			if (eventData.classifications) {
				eventData.classifications.forEach((classification) => {
					if (
						classification.segment &&
						classification.segment.name.toLowerCase() === "music"
					) {
						if (
							classification.genre &&
							classification.genre.name.toLowerCase().includes("festival")
						) {
							eventType = "Festival";
							festival_lineup =
								eventData._embedded?.attractions
									?.map((artist) => artist.name)
									.join(", ") || "Lineup not available";
						} else {
							eventType = "Concert";
							concert_genre =
								classification.genre?.name || "Genre not specified";
							concert_artist =
								eventData._embedded?.attractions?.[0]?.name ||
								"Artist not specified";
						}
					}
				});
			}

			// create a new object for event factory
			let event_factory = EventFactory.createEvent({
				type: eventType,
				date: getValidDate(eventData),
				name: eventData.name,
				genre: concert_genre,
				artist: concert_artist,
				lineup: festival_lineup,
				location: locationString,
				url: eventData.url,
				imageUrl: imageUrl,
				venue: {
					name: venueName,
					address: address,
					city: city,
					state: state,
					postalCode: postalCode,
					country: country,
				},
				spotifyArtists: topArtists.items.map((artist) => artist.name),
			});
			event_factory.saveEvent();
		}

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
		//console.error("An error occurred during the callback:", error);
		if (!res.headersSent) {
			//res.status(500).send("An error occurred during the callback");
		}
	}
};

// Checks if the user's session has an access token and returns the authentication status.
exports.getSession = (req, res) => {
	if (req.session.accessToken) {
		res.json({ isAuthenticated: true, accessToken: req.session.accessToken });
	} else {
		res.redirect(`http://localhost:3000/home`);
	}
};

/* Generates a Spotify authorization URL and sends an HTML snippet
   with a link for the user to authorize the app.*/
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

	res.send(`Click <a href="${authorizationUrl}">here</a> to authorize.`);
};
