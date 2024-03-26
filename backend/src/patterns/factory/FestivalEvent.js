const Event = require("./Event");

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

module.exports = FestivalEvent;
