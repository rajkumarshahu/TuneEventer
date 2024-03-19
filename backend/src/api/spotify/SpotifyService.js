const axios = require("axios");
const qs = require("qs");

class SpotifyService {
	constructor() {
		this.clientId = process.env.SPOTIFY_CLIENT_ID;
		if (!this.clientId) {
			console.error("SPOTIFY_CLIENT_ID environment variable not set");
		}
		this.clientSecret = process.env.SPOTIFY_CLIENT_SECRETE;
		if (!this.clientSecret) {
			console.error("SPOTIFY_CLIENT_SECRET environment variable not set");
		}
		this.redirectUri = process.env.SPOTIFY_REDIRECT_URI; // Ensure this is correctly set
		if (!this.redirectUri) {
			console.error("SPOTIFY_REDIRECT_URI environment variable not set");
		}
	}

	async authenticate() {
		const url = "https://accounts.spotify.com/api/token";
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64"),
		};
		const data = qs.stringify({ grant_type: "client_credentials" });

		try {
			const response = await axios.post(url, data, { headers });
			this.token = response.data.access_token;
			console.log("Spotify authentication successful. Token received.");
		} catch (error) {
			console.error("Spotify authentication failed:", error);
			throw error;
		}
	}

	async exchangeCodeForToken(code) {
		const url = "https://accounts.spotify.com/api/token";
		const data = qs.stringify({
			grant_type: "authorization_code",
			code: code,
			redirect_uri: this.redirectUri,
		});

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				Buffer.from(this.clientId + ":" + this.clientSecret).toString("base64"),
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
			const response = await axios.get(
				"https://api.spotify.com/v1/me/top/artists",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error("Failed to fetch user data:", error);
			throw error;
		}
	}
}

module.exports = SpotifyService;
