const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

const sessionMiddleware = session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({
		mongoUrl: process.env.MONGO_URI,
		collectionName: "sessions",
	}),
	cookie: {
		secure: false,
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24,
	},
});

module.exports = sessionMiddleware;
