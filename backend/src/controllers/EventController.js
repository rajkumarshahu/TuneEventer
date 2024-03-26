const EventModel = require("../models/EventModel");
const path = require("path");

//@desc        Get all events
//@route       GET /events
//@access      Public
exports.getEvents = async (req, res, next) => {
	try {
		const events = await EventModel.find();
		res.status(200).json({ success: true, count: events.length, data: events });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

//@desc        Get single event
//@route       GET /event/:id
//@access      Public
exports.getEvent = async (req, res, next) => {
	try {
		const event = await EventModel.findById(req.params.id);
		if (!event) {
			return res.status(400).json({ success: false });
		}
		res.status(200).json({ success: true, data: event });
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

//@desc        Add new event
//@route       POST /event
//@access      Private
exports.saveEvent = async (req, res, next) => {
	try {
		// Add user to req,body
		// req.body.user = req.user.id;

		const event = await EventModel.create(req.body);
		res.status(201).json({
			success: true,
			data: event,
		});
	} catch (error) {
		res.status(400).json({ success: false });
	}
};

//@desc        Delete event
//@route       DELETE /events/:id
//@access      Private
exports.deleteEvent = async (req, res, next) => {
	try {
		const event = await EventModel.findById(req.params.id);
		await event.deleteOne();
		if (!event) {
			return res.status(400).json({ success: false });
		}

		res.status(200).json({ success: true, data: {} });
	} catch (error) {}
};
