const express = require("express");
const path = require("path");
const colors = require("colors");
const crypto = require("crypto");
const dotenv = require("dotenv");

const corsMiddleware = require("./src/middlewares/cors.js");
const loggerMiddleware = require("./src/middlewares/logger.js");
const sessionMiddleware = require("./src/middlewares/session.js");

const DatabaseService = require("./src/api/database/DatabaseService.js");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
DatabaseService();

// Route files
const users = require("./src/routes/users.route.js");
const events = require("./src/routes/events.route.js");
const authRoutes = require("./src/routes/spotifyAuth.route.js");
const apiRouter = require("./src/routes/api.route.js");

const app = express();

// Use middleware
app.use(corsMiddleware);
app.use(loggerMiddleware);
app.use(sessionMiddleware);

// Body parser
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/users", users);
app.use("/events", events);
app.use("/auth", authRoutes);
app.use("/api", apiRouter);

const PORT = process.env.PORT || 4000;

// Start the server
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
