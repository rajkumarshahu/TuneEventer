const axios = require("axios");
const qs = require("qs");
const querystring = require("querystring");
const crypto = require("crypto");

class SpotifyService {
	constructor() {
		this.clientId = process.env.SPOTIFY_CLIENT_ID;

		this.clientSecret = process.env.SPOTIFY_CLIENT_SECRETE;

		this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	}

	async authenticate() {
		const url = "https://accounts.spotify.com/api/token";
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64"),
		};
		const data = querystring.stringify({ grant_type: "client_credentials" });

		try {
			const response = await axios.post(url, data, { headers });
			this.token = response.data.access_token;
			console.log("Spotify authentication successful. Token received.");
		} catch (error) {
			console.error("Spotify authentication failed:", error);
			throw error;
		}
	}

	// async exchangeCodeForToken(code) {
	// 	const url = "https://accounts.spotify.com/api/token";
	// 	const data = qs.stringify({
	// 		grant_type: "authorization_code",
	// 		code: code,
	// 		redirect_uri: this.redirectUri,
	// 	});

	// 	const headers = {
	// 		"Content-Type": "application/x-www-form-urlencoded",
	// 		Authorization:
	// 			"Basic " +
	// 			Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64"),
	// 	};

	// 	try {
	// 		const response = await axios.post(url, data, { headers });
	// 		return response.data; // This includes access_token, refresh_token, etc.
	// 	} catch (error) {
	// 		console.error("Error exchanging code for token:", error);
	// 		throw error;
	// 	}
	// }

	async exchangeCodeForToken(code) {
		const url = "https://accounts.spotify.com/api/token";
		const data = qs.stringify({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: this.redirectUri,
		});

		// Create the basic auth string using clientId and clientSecret
		const authString = `${this.clientId}:${this.clientSecret}`;

		// Convert to base64
		let base64Auth = Buffer.from(authString).toString("base64");

		// Make the base64 encoding URL-safe by replacing '+' with '-', '/' with '_' and removing '=' padding
		const urlSafeBase64Auth = base64Auth
			.replace(/\+/g, "-")
			.replace(/\//g, "_")
			.replace(/=+$/, "");

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: `Basic ${urlSafeBase64Auth}`,
		};

		try {
			const response = await axios.post(url, data, { headers });
			return response.data; // This includes access_token, refresh_token, etc.
		} catch (error) {
			console.error("Error exchanging code for token:", error);
			throw error;
		}
	}

	async getUserData(accessToken) {
		try {
			const response = await axios.get("https://api.spotify.com/v1/me/", {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			return response.data;
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			throw error;
		}
	}

	async getUserPlaylists(accessToken) {
		const url = "https://api.spotify.com/v1/me/playlists";
		const headers = { Authorization: `Bearer ${accessToken}` };

		try {
			const response = await axios.get(url, { headers });
			return response.data; // This includes items array among other data
		} catch (error) {
			console.error("Error fetching user playlists:", error);
			throw error;
		}
	}

	async getUserTopArtists(
		accessToken,
		timeRange = "medium_term",
		limit = 10,
		offset = 5
	) {
		const endpoint = `https://api.spotify.com/v1/me/top/artists`; // Endpoint for top artists
		const params = new URLSearchParams({
			time_range: timeRange,
			limit,
			offset,
		});

		const headers = { Authorization: `Bearer ${accessToken}` };
		const url = `${endpoint}?${params}`;

		console.log(`Making request to: ${url}`); // Debug log the full URL

		try {
			const response = await axios.get(url, { headers });
			return response.data; // Contains an array of top artists
		} catch (error) {
			console.error(
				"Error fetching user top artists:",
				error.response || error.message
			);
			throw error; // Include error.response to capture Axios errors
		}
	}

	createAuthUrl(scopes) {
		const state = crypto.randomBytes(16).toString("hex");
		const authQuery = querystring.stringify({
			response_type: "code",
			client_id: this.clientId,
			scope: scopes.join(" "),
			redirect_uri: this.redirectUri,
			state: state,
			show_dialog: true,
		});

		let auth_url = `https://accounts.spotify.com/authorize?${authQuery}`;

		return auth_url;
	}
}

module.exports = SpotifyService;
