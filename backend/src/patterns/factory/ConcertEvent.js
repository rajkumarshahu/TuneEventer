const Event = require("./Event");
const EventModel = require("../../models/EventModel");

// ConcertEvent subclass
class ConcertEvent extends Event {
	constructor(data) {
		super(data);
		this.artist = data.artist;
		this.genre = data.genre;
		// ... properties specific to concerts
	}

	async saveEvent() {
		// console.log(this);
		// save event in database
		let existingEvent = await EventModel.findOne({
			url: this.url,
		});
		if (!existingEvent) {
			console.log("concert event new");
			existingEvent = new EventModel({
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
			console.log("concert event update");
			existingEvent.name = this.name;
			existingEvent.date = this.date;
			existingEvent.artist = this.artist;
			existingEvent.genre = this.genre;
			existingEvent.location = this.location;
			existingEvent.detailsUrl = this.url;
			existingEvent.imageUrl = this.imageUrl;
			existingEvent.spotifyArtists = this.spotifyArtists;
			existingEvent.venue = this.venue;
		}
		await existingEvent.save();
	}

	// Method specific to ConcertEvent
	getArtistLineup() {
		return `Featuring artist: ${this.artist}`;
	}
}

module.exports = ConcertEvent;
