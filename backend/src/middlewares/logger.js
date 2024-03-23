const colors = require("colors");

const logger = (req, res, next) => {
	console.log(colors.cyan(`${req.method} ${req.originalUrl}`));
	next();
};

module.exports = logger;
