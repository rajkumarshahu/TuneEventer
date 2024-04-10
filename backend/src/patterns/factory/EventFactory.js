const ConcertEvent = require("./ConcertEvent");
const FestivalEvent = require("./FestivalEvent");

/**
 * EventFactory class providing a static method to create specific event objects.
 * This implementation utilizes the Factory Method design pattern to abstract the
 * instantiation process for different types of events based on the provided data.
 */
class EventFactory {
	/**
	 * Static method to create and return an event object based on the event type specified in the data.
	 * @param {Object} data - Data object containing details about the event, including its type.
	 * @returns {ConcertEvent|FestivalEvent|null} - An instance of the specified event type or null if the type is unknown.
	 */
	static createEvent(data) {
		// Check if the event type is provided; if not, throw an error.
		if (!data.type) {
			throw new Error("Event type must be specified");
		}

		// Determine the type of event to create based on the provided type in the data.
		switch (data.type.toLowerCase()) {
			case "concert":
				// Create and return a new ConcertEvent if the type is 'concert'.
				return new ConcertEvent(data);
			case "festival":
				// Create and return a new FestivalEvent if the type is 'festival'.
				return new FestivalEvent(data);
			default:
				// Log a message and return null if the event type is unknown.
				console.log(`Unknown event type: ${data.type}`);
				return null;
		}
	}
}

module.exports = EventFactory;
