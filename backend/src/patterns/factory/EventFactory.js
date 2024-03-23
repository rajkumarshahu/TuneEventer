// Event base class
class Event {
	constructor(data) {
		this.name = data.name;
		this.date = new Date(data.date);
		this.venue = data.venue;
		// ... other properties common to all events
	}

	// Common method for all events
	getDescription() {
		return `${this.name} at ${this.venue} on ${this.date.toDateString()}`;
	}
}

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

// FestivalEvent subclass
class FestivalEvent extends Event {
	constructor(data) {
		super(data);
		this.lineup = data.lineup; // Array of artists
		// ... properties specific to festivals
	}

	// Method specific to FestivalEvent
	getFestivalLineup() {
		return `Festival lineup: ${this.lineup.join(", ")}`;
	}
}

// EventFactory with a method to create event objects
class EventFactory {
	static createEvent(data) {
		if (!data.type) {
			throw new Error("Event type must be specified");
		}

		switch (data.type.toLowerCase()) {
			case "concert":
				return new ConcertEvent(data);
			case "festival":
				return new FestivalEvent(data);
			default:
				throw new Error("Unknown event type: " + data.type);
		}
	}
}

module.exports = EventFactory;

// Example usage
const concertData = {
	type: "Concert",
	name: "Rocking the Arena",
	date: "2023-09-12",
	venue: "The Grand Arena",
	artist: "The Rockers",
	genre: "Rock",
};

const festivalData = {
	type: "Festival",
	name: "Summer Sounds Festival",
	date: "2023-08-05",
	venue: "Beachside Park",
	lineup: ["DJ Beat", "The Groovers", "Melody Queens"],
};

try {
	const concert = EventFactory.createEvent(concertData);
	console.log(concert.getDescription()); // Output description of the concert
	console.log(concert.getArtistLineup()); // Output the artist performing

	const festival = EventFactory.createEvent(festivalData);
	console.log(festival.getDescription()); // Output description of the festival
	console.log(festival.getFestivalLineup()); // Output the festival lineup
} catch (error) {
	console.error(error.message);
}
