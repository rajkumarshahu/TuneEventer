module.exports.isAuthenticated = (req, res, next) => {
	// First, check if there's a session and a session field
	if (req.session && req.session.session) {
		// Parse the session string into an object
		const sessionData = JSON.parse(req.session.session);

		// Now, check if the parsed session object has an accessToken
		if (sessionData.accessToken) {
			// If accessToken exists, the user is considered authenticated
			return next();
		}
	}

	return res
		.status(401)
		.send("Unauthorized: No active session or accessToken found");
};
