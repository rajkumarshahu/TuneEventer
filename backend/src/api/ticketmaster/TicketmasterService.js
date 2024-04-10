/**
 * The TicketmasterService class encapsulates methods to interact with the Ticketmaster API.
 * It provides functionality to fetch events based on an artist's name or a combination of genre and country.
 */
const axios = require("axios");
class TicketmasterService {
	/**
	 * Initializes the service with the Ticketmaster API key and base URL.
	 */
	constructor() {
		this.apiKey = process.env.TICKETMASTER_API;
		this.baseUrl = "https://app.ticketmaster.com/discovery/v2/";
	}

	/**
	 * Fetches events from Ticketmaster associated with a given artist's name.
	 * @param {string} artistName - The name of the artist to search for events.
	 * @returns {Promise<Array>} A promise that resolves to an array of events related to the artist.
	 */
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

	/**
	 * Fetches events from Ticketmaster based on an array of genres and a specific country code.
	 * @param {Array<string>} genre_arr - An array of genres to filter events.
	 * @param {string} country - The country code to filter events.
	 * @returns {Promise<Array>} A promise that resolves to an array of events that match the given genres and country.
	 */
	async fetchEventsByGenreAndCountry(genre_arr, country) {
		const url = `${
			this.baseUrl
		}events.json?classificationName=${genre_arr}&countryCode=${encodeURIComponent(
			country
		)}&apikey=${this.apiKey}&classificationName=concert,festival`;

		console.log(url);

		try {
			const response = await axios.get(url);

			return response.data._embedded ? response.data._embedded.events : [];
		} catch (error) {
			console.error(
				"Error fetching events by genre and country from Ticketmaster:",
				error
			);
			throw error;
		}
	}
}

module.exports = TicketmasterService;
