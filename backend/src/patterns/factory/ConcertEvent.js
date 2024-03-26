const Event = require("./Event");

// ConcertEvent subclass
class ConcertEvent extends Event {
	constructor(data) {
		super(data);
		this.artist = data.artist;
		this.genre = data.genre;
		// ... properties specific to concerts
	}

	// Method specific to ConcertEvent
	getArtistLineup() {
		return `Featuring artist: ${this.artist}`;
	}
}

module.exports = ConcertEvent;
