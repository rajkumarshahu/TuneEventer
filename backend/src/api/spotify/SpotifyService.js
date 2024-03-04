const axios = require("axios");
const qs = require("qs");

class SpotifyService {
	constructor() {
		this.clientId = "011c21309b674aadaf1ea09c09da535d";
		this.clientSecret = "e90b9b368c244b77b2e35e2045b9c737";
		this.token =
			"Bearer BQDamQGFgzZNJ9mfTDy45pPSasHfVtcGjZvoFSBVoMCNyPh0MP_L4TDtRfj0FAaxEpRBq8XuIW3VcTExsjH9IKvME7wAs-72q24RWbCcxtyxB-tKCag";
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
