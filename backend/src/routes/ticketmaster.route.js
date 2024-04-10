const express = require("express");

// Import the fetchArtistEvents function from the ticketmasterController
const { fetchArtistEvents } = require("../controllers/ticketmasterController");

const router = express.Router();

// Define a GET route for fetching artist events
// When a GET request is made to /events/:artistName, fetchArtistEvents controller is invoked
router.get("/events/:artistName", fetchArtistEvents);

module.exports = router;
