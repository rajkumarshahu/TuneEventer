const axios = require("axios");
const qs = require("qs");

class SpotifyService {
	constructor() {
		this.clientId = process.env.SPOTIFY_CLIENT_ID;
		this.clientSecret = process.env.SPOTIFY_CLIENT_SECRETE;
		this.token = process.env.SPOTIFY_TOKEN;
	}

	async authenticate() {
		const url = "https://accounts.spotify.com/api/token";
		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization:
				"Basic " +
				new Buffer(this.clientId + ":" + this.clientSecret).toString("base64"),
		};
		const data = qs.stringify({ grant_type: "client_credentials" });

		try {
			const response = await axios.post(url, data, { headers });
			this.token = response.data.access_token;
		} catch (error) {
			console.error("Spotify authentication failed:", error);
		}
	}

	// TODO: Additional methods to interact with the Spotify API
}

module.exports = SpotifyService;
