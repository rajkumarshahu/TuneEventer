// Event base class
class Event {
	constructor(data) {
		this.type = data.type;
		this.name = data.name;
		this.date = new Date(data.date);
		this.url = data.url;
		this.imageUrl = data.imageUrl;
		this.location = data.location;
		this.venue = data.venue;
		this.spotifyArtists = data.spotifyArtists;
	}

	// Common method for all events
	getDescription() {
		return `${this.name} at ${this.venue} on ${this.date.toDateString()}`;
	}

	// saveEvent() {}
}

module.exports = Event;
