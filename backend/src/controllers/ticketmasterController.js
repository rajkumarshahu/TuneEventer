const ApiServiceProxy = require("../patterns/proxy/ApiServiceProxy.js");
const SpotifyService = require("../api/spotify/SpotifyService.js");
const TicketmasterService = require("../api/ticketmaster/TicketmasterService.js");
const spotifyService = new SpotifyService();
const ticketMasterService = new TicketmasterService();
const apiServiceProxy = new ApiServiceProxy(
	spotifyService,
	ticketMasterService
);

/**
 * This function handles the endpoint for fetching events related to a specific artist.
 * It extracts the artist's name from the request parameters and uses the ApiServiceProxy
 * to fetch event data from Ticketmaster. On success, it sends the events data as a JSON response.
 * If an error occurs, it logs the error and returns a server error response.
 */
exports.fetchArtistEvents = async (req, res) => {
	try {
		const { artistName } = req.params;

		const events = await apiServiceProxy.fetchTicketmasterData(artistName);
		res.json(events);
	} catch (error) {
		console.error(colors.red(`Error: ${error.message}`));
		res.status(500).send("Server Error");
	}
};
