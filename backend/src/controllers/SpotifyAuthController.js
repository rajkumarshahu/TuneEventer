const SpotifyService = require("../api/spotify/SpotifyService");
const spotifyService = new SpotifyService();

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
		//const user_data = await spotifyService.getUserData(data.access_token);

		// save in user collection.

		// CALL eventmaster with user's genre and country, => save events for the user

		//

		// req.session.displayName = user_data.display_name;
		// req.session.country = user_data.country;
		// req.session.email = user_data.email;
		req.session.accessToken = data.access_token;
		req.session.refreshToken = data.refresh_token;
		req.session.expiresIn = data.expires_in;
		req.session.save((err) => {
			if (err) {
				console.error("Session save error:", err);
				return res.status(500).send("Error saving the session");
			}
			//res.redirect(`http://localhost:3000/?access_token=${data.access_token}`);
			res.redirect(`http://localhost:3000/top-artists`);
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("An error occurred during the callback");
	}
};

// Checks if the user's session has an access token and returns the authentication status.
exports.getSession = (req, res) => {
	if (req.session.accessToken) {
		res.json({ isAuthenticated: true, accessToken: req.session.accessToken });
	} else {
		res.json({ isAuthenticated: false });
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
