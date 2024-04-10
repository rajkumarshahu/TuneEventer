const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const SpotifyService = require("../api/spotify/SpotifyService.js");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");

// Instantiating the Spotify and Ticketmaster services
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();

// Creating an instance of ApiServiceProxy, passing in the Spotify and Ticketmaster services
// This setup allows for centralized management and potential caching of API requests
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

/**
 * Exporting a controller function to handle requests for fetching artist events.
 * Utilizes the ApiServiceProxy to abstract away direct interactions with the Ticketmaster API.
 */
exports.fetchArtistEvents = async (req, res) => {
	try {
		// Extracting the artist name from the request parameters
		const { artistName } = req.params;

		// Using the ApiServiceProxy to fetch events for the specified artist from Ticketmaster
		const events = await apiServiceProxy.fetchTicketmasterData(artistName);

		res.json(events);
	} catch (error) {
		console.error(colors.red(`Error: ${error.message}`));

		res.status(500).send("Server Error");
	}
};
