const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		genre: [String],
		location: {
			type: String,
			required: true,
		},
		detailsUrl: {
			type: String,
			required: true,
		},
		spotifyArtists: [String],
	},
	{ timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
