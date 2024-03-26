const express = require("express");
const { fetchArtistEvents } = require("../controllers/ticketmasterController");

const router = express.Router();

router.get("/events/:artistName", fetchArtistEvents);

module.exports = router;
