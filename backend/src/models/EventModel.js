const mongoose = require("mongoose");

// Schema for event venue details
const VenueSchema = new mongoose.Schema({
	name: String,
	address: { line1: String },
	city: String,
	state: String,
	postalCode: String,
	country: String,
});

// Base schema for all types of events
const EventSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true, // Event type (e.g., concert, festival) - used for discriminator
		},
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
		url: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		spotifyArtists: [String],
		venue: VenueSchema, // Embedded venue schema
	},
	{
		timestamps: true,
		discriminatorKey: "type", // Key to use for discriminating between different event types
	}
);

// Create a base Event model from the EventSchema
const EventModel = mongoose.model("Event", EventSchema, "events");

// Discriminator for ConcertEvent - extends Event with specific fields for concerts
const ConcertEvent = EventModel.discriminator(
	"ConcertEvent",
	new mongoose.Schema(
		{
			artist: {
				type: String,
				required: true, // Main artist or band performing at the concert
			},
			genre: {
				type: [String],
				required: true, // Genres of music played at the concert
			},
		},
		{ _id: false } // Do not create a separate _id for the discriminator
	)
);

// Discriminator for FestivalEvent - extends Event with specific fields for festivals
const FestivalEvent = EventModel.discriminator(
	"FestivalEvent",
	new mongoose.Schema(
		{
			lineup: {
				type: [String],
				required: true, // List of artists/acts performing at the festival
			},
		},
		{ _id: false } // Do not create a separate _id for the discriminator
	)
);

module.exports = { EventModel, ConcertEvent, FestivalEvent };
