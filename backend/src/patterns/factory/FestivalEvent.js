const Event = require("./Event");
/* Importing the FestivalEventModel from EventModel 
   for handling festival event specific data in the database. */
const {
	FestivalEvent: FestivalEventModel,
} = require("../../models/EventModel");

/**
 * FestivalEvent class extending the base Event class
 * to include properties and methods specific to festival events.
 */
class FestivalEvent extends Event {
	constructor(data) {
		super(data); // Invoking the constructor of the base Event class.
		this.lineup = data.lineup; // Storing the lineup of artists/acts performing at the festival.
	}

	/**
	 * Asynchronously saves or updates the festival event in the database.
	 * If the event does not exist, it creates a new festival event entry.
	 * If it already exists, it updates the existing entry's lineup.
	 */
	async saveEvent() {
		try {
			console.log("Attempting to save festival event");
			// Attempt to find an existing event with the same URL.
			let existingEvent = await FestivalEventModel.findOne({
				url: this.url,
			});
			if (!existingEvent) {
				console.log("Creating new festival event");
				// If not found, create a new FestivalEventModel instance for saving.
				existingEvent = new FestivalEventModel({
					type: "FestivalEvent",
					name: this.name,
					date: new Date(this.date),
					lineup: this.lineup,
					location: this.location,
					url: this.url,
					imageUrl: this.imageUrl,
					spotifyArtists: this.spotifyArtists,
					venue: this.venue,
				});
			} else {
				// If found, update the lineup of the existing event.
				existingEvent.lineup = this.lineup;
			}
			// Save the new or updated event to the database.
			await existingEvent.save();
		} catch (error) {
			console.error("Failed to save or update the festival event:", error);
		}
	}

	/**
	 * Returns a formatted string listing the artists/acts in the festival lineup.
	 */
	getFestivalLineup() {
		return `Festival lineup: ${this.lineup.join(", ")}`;
	}
}

module.exports = FestivalEvent;
