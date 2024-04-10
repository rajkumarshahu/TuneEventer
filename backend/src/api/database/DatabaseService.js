/**
 * DatabaseService is an asynchronous function that connects to a MongoDB database
 * using the mongoose library. The connection URI is retrieved from environment variables.
 * On successful connection, a success message including the database host is logged to the console.
 * In case of an error during the connection process, the error message is logged and the application
 * exits with a failure status.
 */
const mongoose = require("mongoose");

const DatabaseService = async () => {
	try {
		// Attempt to connect to MongoDB using the connection URI from environment variables
		const conn = await mongoose.connect(process.env.MONGO_URI);
		// Log the successful connection message, including the host name
		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
		);
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

module.exports = DatabaseService;
