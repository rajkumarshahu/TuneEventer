const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const EventModel = require("./src/models/EventModel");
const UserModel = require("./src/models/UserModel");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const events = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/events.json`, "utf-8")
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

// Import into DB
const importData = async () => {
	try {
		await EventModel.create(events);
		await UserModel.create(users);

		console.log("Data Imported...".green.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await EventModel.deleteMany();
		await UserModel.deleteMany();
		console.log("Data Destroyed...".red.inverse);
		process.exit();
	} catch (err) {
		console.error(err);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
