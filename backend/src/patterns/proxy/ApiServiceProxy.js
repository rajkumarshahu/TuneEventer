const axios = require("axios");

class ApiServiceProxy {
	constructor(spotifyService, ticketmasterService, ticketmasterApiKey) {
		this.spotifyService = spotifyService;
		this.ticketmasterService = ticketmasterService;
		this.ticketmasterBaseUrl = "https://app.ticketmaster.com/discovery/v2";
		this.ticketmasterApiKey = ticketmasterApiKey;
	}

	/*async fetchSpotifyData(endpoint, params = {}) {
		try {
			const token = await this.spotifyService.getToken();
			console.log("Token: ", token);
			const response = await axios.get(
				`https://api.spotify.com/v1/${endpoint}`,
				{
					headers: { Authorization: `Bearer ${token}` },
					params,
				}
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching data from Spotify:", error);
			throw error;
		}
	}*/

	async fetchSpotifyData(endpoint, btoken) {
		try {
			//const token = await this.spotifyService.getToken();
			//console.log("Token: ", btoken);
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
}

module.exports = ApiServiceProxy;
