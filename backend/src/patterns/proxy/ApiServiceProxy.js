const axios = require("axios");

/**
 * ApiServiceProxy serves as an intermediary for communicating
 * with Spotify and Ticketmaster APIs.
 * It contains methods to fetch data from both services
 * using the credentials provided upon instantiation.
 */
class ApiServiceProxy {
	constructor(spotifyService, ticketmasterService, ticketmasterApiKey) {
		this.spotifyService = spotifyService;
		this.ticketmasterService = ticketmasterService;
		this.ticketmasterBaseUrl = "https://app.ticketmaster.com/discovery/v2";
		this.ticketmasterApiKey = ticketmasterApiKey;
	}

	/**
	 * Fetches data from a specific Spotify API endpoint.
	 *
	 * @param {string} endpoint - The Spotify API endpoint to fetch data from.
	 * @param {string} btoken - The bearer token for authentication.
	 * @returns The data received from the Spotify API endpoint.
	 * @throws Will throw an error if the request fails.
	 */

	async fetchSpotifyData(endpoint, btoken) {
		try {
			const response = await axios.get(
				`https://api.spotify.com/v1/${endpoint}`,
				{
					headers: { Authorization: `Bearer ${btoken}` },
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching data from Spotify:", error);
			throw error;
		}
	}

	/**
	 * Fetches event data related to an artist from the Ticketmaster API.
	 *
	 * @param {string} artistName - The name of the artist to fetch event data for.
	 * @returns The events data received from the Ticketmaster API.
	 * @throws Will throw an error if the request fails.
	 */

	async fetchTicketmasterData(artistName) {
		try {
			// Utilize the fetchArtistEvents method from TicketmasterService
			const events = await this.ticketmasterService.fetchArtistEvents(
				artistName
			);
			return events;
		} catch (error) {
			console.error("Error fetching data from Ticketmaster:", error);
			throw error;
		}
	}

	// search ticket master by genre
}

module.exports = ApiServiceProxy;
