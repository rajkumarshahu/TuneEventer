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

module.exports = Event;
