const EventFactory = require("./EventFactory");

// Example usage
const concertData = {
	type: "Concert",
	name: "Rocking the Arena",
	date: "2023-09-12",
	venue: "The Grand Arena",
	artist: "The Rockers",
	genre: "Rock",
};

const festivalData = {
	type: "Festival",
	name: "Summer Sounds Festival",
	date: "2023-08-05",
	venue: "Beachside Park",
	lineup: ["DJ Beat", "The Groovers", "Melody Queens"],
};

try {
	const concert = EventFactory.createEvent(concertData);
	console.log(concert.getDescription()); // Output description of the concert
	console.log(concert.getArtistLineup()); // Output the artist performing

	const festival = EventFactory.createEvent(festivalData);
	console.log(festival.getDescription()); // Output description of the festival
	console.log(festival.getFestivalLineup()); // Output the festival lineup
} catch (error) {
	console.error(error.message);
}
