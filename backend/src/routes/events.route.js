const express = require("express");
const {
	getEvents,
	getEvent,
	saveEvent,
	deleteEvent,
} = require("../controllers/EventController");

var router = express.Router({ mergeParams: true });

router.route("/").get(getEvents).post(saveEvent);

router.route("/:id").get(getEvent).delete(deleteEvent);

module.exports = router;
