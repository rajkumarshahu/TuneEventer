/**
 * The SpotifyService class encapsulates the interaction with the Spotify Web API.
 * It provides methods for authenticating with Spotify, exchanging authorization codes for tokens,
 * fetching user data, and generating authorization URLs.
 */
const axios = require("axios");
const qs = require("qs");
const querystring = require("querystring");
const crypto = require("crypto");

class SpotifyService {
	/**
	 * Initializes the service with Spotify client credentials and redirect URI from environment variables.
	 */
	constructor() {
		this.clientId = process.env.SPOTIFY_CLIENT_ID;
		this.clientSecret = process.env.SPOTIFY_CLIENT_SECRETE;
		this.redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	}

	/**
	 * Authenticates with Spotify to get an application access token.
	 */
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

	/**
	 * Gets the current token, authenticating if necessary.
	 * @returns {Promise<string>} The current access token.
	 */
	async getToken() {
		if (!this.token) {
			await this.authenticate();
		}
		return this.token;
	}

	/**
	 * Exchanges an authorization code for an access token and refresh token.
	 * @param {string} code - The authorization code to exchange.
	 * @returns {Promise<Object>} An object containing the access and refresh tokens.
	 */
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
			return response.data;
		} catch (error) {
			console.error("Error exchanging code for token:", error);
			throw error;
		}
	}

	/**
	 * Fetches the authenticated user's data.
	 * @param {string} accessToken - The access token for the authenticated user.
	 * @returns {Promise<Object>} An object containing the user's Spotify profile data.
	 */
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

	/**
	 * Creates a URL to initiate the Spotify authorization process.
	 * @param {Array<string>} scopes - The scopes for which to request permission.
	 * @returns {string} The URL to redirect the user to for authorization.
	 */
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
