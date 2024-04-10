/**
 * Event is a base class representing a general event.
 * It encapsulates common properties and methods applicable to all types of events.
 */
class Event {
	/**
	 * Constructor for the Event class.
	 * Initializes a new instance of an Event with provided data.
	 * @param {Object} data - An object containing event-related information.
	 */
	constructor(data) {
		this.type = data.type; // Type of the event
		this.name = data.name; // Name of the event
		this.date = new Date(data.date); // Date of the event
		this.url = data.url; // URL for the event's details
		this.imageUrl = data.imageUrl; // URL for the event's image
		this.location = data.location; // Location of the event
		this.venue = data.venue; // Venue where the event takes place
		this.spotifyArtists = data.spotifyArtists; // Array of Spotify artist IDs associated with the event
	}

	/**
	 * Generates and returns a descriptive string for the event.
	 * @returns {String} A string describing the event with its name, venue, and date.
	 */
	getDescription() {
		// Formats the date to a more readable form and constructs the description
		return `${this.name} at ${this.venue} on ${this.date.toDateString()}`;
	}
}

module.exports = Event;
