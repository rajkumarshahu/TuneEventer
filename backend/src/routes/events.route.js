const express = require("express");
const { getEvents, saveEvent } = require("../controllers/EventController");

var router = express.Router({ mergeParams: true });

router.route("/").get(getEvents).post(saveEvent);

module.exports = router;
