const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
	name: String,
	address: {
		line1: String,
	},
	city: String,
	state: String,
	postalCode: String,
	country: String,
});

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
		genre: {
			type: [String],
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		spotifyArtists: {
			type: [String],
			required: true,
		},
		venue: VenueSchema,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("EventModel", EventSchema, "events");
