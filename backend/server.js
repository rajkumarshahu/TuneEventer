const express = require("express"); // Express for server operations
const path = require("path"); // Path for file path operations
const colors = require("colors"); // Colors for colorful console output
const crypto = require("crypto"); // Crypto for cryptographic functions
const dotenv = require("dotenv"); // Dotenv for environment variable management

// Import custom middleware functions
const corsMiddleware = require("./src/middlewares/cors.js"); // CORS middleware for handling Cross-Origin Resource Sharing
const loggerMiddleware = require("./src/middlewares/logger.js"); // Logger middleware for logging requests
const sessionMiddleware = require("./src/middlewares/session.js"); // Session middleware for managing user sessions

// Import the database service
const DatabaseService = require("./src/api/database/DatabaseService.js"); // Service for database connection and operations

// Load environment variables from .env file
dotenv.config({ path: "./config/config.env" });

// Initialize database connection
DatabaseService();

// Define routes
const authRoutes = require("./src/routes/spotifyAuth.route.js"); // Routes for Spotify authentication
const apiRouter = require("./src/routes/api.route.js"); // API routes for application logic

// Create Express app
const app = express();

// Apply middleware
app.use(corsMiddleware); // Enable CORS
app.use(loggerMiddleware); // Log every request to the console
app.use(sessionMiddleware); // Use session management

// Enable body parsing for JSON payloads
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Mount route handlers
app.use("/auth", authRoutes); // Handle auth-related routes
app.use("/api", apiRouter); // Handle API routes

// Define the port to run the server on
const PORT = process.env.PORT || 4000;

// Start listening for requests on the defined PORT
const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
			.bold
	)
);
