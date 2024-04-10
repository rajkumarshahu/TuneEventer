const mongoose = require("mongoose");

/**
 * Schema definition for a user.
 * This schema includes information related to a user's Spotify account,
 * as well as their preferences and recommendations within the application.
 */
const UserSchema = new mongoose.Schema(
	{
		spotifyId: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		displayName: {
			type: String,
			required: true,
		},
		profileUrl: String,
		accessToken: {
			type: String,
			required: true,
		},
		refreshToken: String,
		favoriteGenres: [String],
		recommendedEvents: [
			{
				type: mongoose.Schema.Types.ObjectId, // References to Event documents
				ref: "Event", // Indicates the model to use during population
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserModel", UserSchema, "users");
