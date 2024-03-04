const axios = require("axios");

class TicketmasterService {
	constructor() {
		this.apiKey = process.env.TICKETMASTER_API;
	}

	async fetchEvents(artistName) {
		const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(
			artistName
		)}&apikey=${this.apiKey}`;

		try {
			const response = await axios.get(url);
			return response.data._embedded.events;
		} catch (error) {
			console.error("Error fetching events from Ticketmaster:", error);
			return [];
		}
	}

	// Additional methods as needed
}

module.exports = TicketmasterService;
