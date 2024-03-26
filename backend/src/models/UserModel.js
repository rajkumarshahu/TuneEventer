const mongoose = require("mongoose");

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
				type: mongoose.Schema.Types.ObjectId,
				ref: "Event",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserModel", UserSchema, "users");
