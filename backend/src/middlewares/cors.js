const cors = require("cors");

/**
 * Configuration options for the CORS middleware.
 * This configuration allows requests from the specified origin and enables sending credentials
 * such as cookies and HTTP authentication over CORS.
 */
const corsOptions = {
	origin: "http://localhost:3000", // Specifies that only requests from this origin are allowed
	credentials: true, // Allows the browser to send cookies and HTTP authentication information along with the request
};

module.exports = cors(corsOptions);
