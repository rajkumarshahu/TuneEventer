const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

/**
 * Session middleware configuration.
 * This middleware enables session management in Express applications,
 * with session data stored in MongoDB.
 */
const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: false, // Prevents session being saved back to the session store, even if the session was never modified during the request.
	saveUninitialized: false, // Prevents saving uninitialized session to the store.
	store: MongoStore.create({
		mongoUrl: process.env.MONGO_URI, // MongoDB connection string from environment variables
		collectionName: "sessions", // Collection where sessions will be stored in MongoDB
	}),
	cookie: {
		secure: false,
		httpOnly: true, // Helps mitigate the risk of client side script accessing the protected cookie.
		maxAge: 1000 * 60 * 60 * 24, // Sets the cookie's expiration time. Here, set to 24 hours.
	},
});

module.exports = sessionMiddleware;
