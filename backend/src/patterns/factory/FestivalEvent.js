const Event = require("./Event");
const EventModel = require("../../models/EventModel");

// FestivalEvent subclass
class FestivalEvent extends Event {
	constructor(data) {
		super(data);
		this.lineup = data.lineup; // Array of artists
	}

	async saveEvent() {
		console.log("festival event save");
		// save event in database
		let existingEvent = await EventModel.findOne({
			url: this.url,
		});
		if (!existingEvent) {
			existingEvent = new EventModel({
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
			existingEvent.name = this.name;
			existingEvent.date = this.date;
			existingEvent.lineup = this.lineup;
			existingEvent.location = this.location;
			existingEvent.detailsUrl = this.url;
			existingEvent.imageUrl = this.imageUrl;
			existingEvent.spotifyArtists = this.spotifyArtists;
			existingEvent.venue = this.venue;
		}
		await existingEvent.save();
	}

	// Method specific to FestivalEvent
	getFestivalLineup() {
		return `Festival lineup: ${this.lineup.join(", ")}`;
	}
}

module.exports = FestivalEvent;
