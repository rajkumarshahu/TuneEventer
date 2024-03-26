const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
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

module.exports = mongoose.model("EventModel", EventSchema, "events");
