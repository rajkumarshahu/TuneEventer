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

	/*async fetchEventsByGenreAndCountry(genre_arr, country) {
		const url = `${
			this.baseUrl
		}events.json?classificationName=${genre_arr}&countryCode=${encodeURIComponent(
			country
		)}&apikey=${this.apiKey}&classificationName=concert,festival`;

		console.log(url);

		try {
			const response = await axios.get(url);
			// Adjust the path to the events array according to the actual response structure
			return response.data._embedded ? response.data._embedded.events : [];
		} catch (error) {
			console.error(
				"Error fetching events by genre and country from Ticketmaster:",
				error
			);
			throw error;
		}
	}*/

	async fetchEventsByGenreAndCountry(genre_arr, country) {
		const events = [];
		for (const genre of genre_arr) {
			const url = `${
				this.baseUrl
			}events.json?classificationName=${encodeURIComponent(
				genre
			)}&countryCode=${encodeURIComponent(country)}&apikey=${
				this.apiKey
			}&classificationName=concert,festival`;
			// console.log(url);

			try {
				const response = await axios.get(url);
				// Assuming the path to the events array in the response is response.data._embedded.events
				if (response.data._embedded && response.data._embedded.events) {
					// Aggregate events from each genre
					events.push(...response.data._embedded.events);
				}
			} catch (error) {
				console.error(
					`Error fetching events for genre ${genre} and country ${country} from Ticketmaster:`,
					error
				);
				// Optionally, you could choose to throw an error or continue fetching the remaining genres
			}
		}

		// Optionally deduplicate events based on their ID or any other unique property
		// This step is necessary if the same event can be returned in multiple genres
		const uniqueEvents = [
			...new Map(events.map((event) => [event.id, event])).values(),
		];

		return uniqueEvents;
	}
}

module.exports = TicketmasterService;
