const axios = require("axios");
class TicketmasterService {
	constructor() {
		this.apiKey = process.env.TICKETMASTER_API;
		this.baseUrl = "https://app.ticketmaster.com/discovery/v2/";
	}

	async fetchArtistEvents(artistName) {
		const url = `${this.baseUrl}events.json?keyword=${encodeURIComponent(
			artistName
		)}&apikey=${this.apiKey}`;

		try {
			const response = await axios.get(url);
			return response.data._embedded.events;
		} catch (error) {
			console.error("Error fetching artist events from Ticketmaster:", error);
			throw error;
		}
	}
}

module.exports = TicketmasterService;
