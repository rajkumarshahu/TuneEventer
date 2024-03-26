const ConcertEvent = require("./ConcertEvent");
const FestivalEvent = require("./FestivalEvent");

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
