const Event = require("./Event");
// Import the ConcertEventModel for database operations specific to Concert Events
const { ConcertEvent: ConcertEventModel } = require("../../models/EventModel");

/**
 * ConcertEvent class extending the base Event class to include properties and methods
 * specific to concert events.
 */
class ConcertEvent extends Event {
	/**
	 * Constructor for the ConcertEvent class.
	 * Initializes a new instance of a ConcertEvent with provided data.
	 * @param {Object} data - An object containing concert event-related information.
	 */
	constructor(data) {
		super(data); // Call the constructor of the base Event class
		this.artist = data.artist; // The main artist or band performing at the concert
		this.genre = data.genre; // The genre of music for the concert
	}

	/**
	 * Asynchronously saves or updates the concert event in the database.
	 * If the event does not exist, it creates a new concert event entry.
	 * If it already exists, it updates the existing entry's artist and genre.
	 */
	async saveEvent() {
		// Attempt to find an existing concert event with the same URL
		let existingEvent = await ConcertEventModel.findOne({ url: this.url });

		if (!existingEvent) {
			console.log("Creating new concert event");
			// If not found, create a new ConcertEventModel instance for saving
			existingEvent = new ConcertEventModel({
				type: "ConcertEvent",
				name: this.name,
				date: new Date(this.date),
				artist: this.artist,
				genre: this.genre,
				location: this.location,
				url: this.url,
				imageUrl: this.imageUrl,
				spotifyArtists: this.spotifyArtists,
				venue: this.venue,
			});
		} else {
			// If found, update the artist and genre of the existing event
			existingEvent.artist = this.artist;
			existingEvent.genre = this.genre;
		}

		// Save the new or updated concert event to the database
		await existingEvent.save();
	}

	/**
	 * Returns a string describing the main artist performing at the concert.
	 * @returns {String} A string detailing the artist featured in the concert.
	 */
	getArtistLineup() {
		return `Featuring artist: ${this.artist}`;
	}
}

module.exports = ConcertEvent;
