const colors = require("colors");

/**
 * Middleware function for logging request information.
 * This function logs the HTTP method and the original URL of each request received by the server.
 *
 * @param {Object} req - The request object provided by Express.
 * @param {Object} res - The response object provided by Express.
 * @param {Function} next - The next middleware function in the stack.
 */
const logger = (req, res, next) => {
	// Log the HTTP method and original URL of the request
	console.log(colors.cyan(`${req.method} ${req.originalUrl}`));
	next();
};

module.exports = logger;
