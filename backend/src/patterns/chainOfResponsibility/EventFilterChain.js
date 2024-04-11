/**
 * Handler is an abstract base class representing a handler in a chain of responsibility pattern.
 * It defines the structure for processing requests and passing them along the chain.
 */
class Handler {
	constructor() {
		this.nextHandler = null; // Reference to the next handler in the chain
	}

	/**
	 * Sets the next handler in the chain and returns it to allow for chaining.
	 * @param {Handler} handler - The next handler in the chain.
	 * @returns {Handler} The next handler.
	 */
	setNext(handler) {
		this.nextHandler = handler;
		return handler; // Allows chaining
	}

	/**
	 * Processes the request or passes it to the next handler in the chain.
	 * @param {Object} query - The MongoDB query object to be modified.
	 * @param {Object} request - The request object containing filters to apply.
	 */
	handle(query, request) {
		if (this.nextHandler) {
			return this.nextHandler.handle(query, request);
		}
	}
}

/**
 * GenreFilter extends Handler to specifically handle filtering by genre.
 */
class GenreFilter extends Handler {
	/**
	 * Handles adding a genre filter to the query, if a genre is specified in the request.
	 * @param {Object} query - The MongoDB query object to be modified.
	 * @param {Object} request - The request object containing the genre filter.
	 * @returns
	 */
	handle(query, request) {
		if (request.genre) {
			query.genre = request.genre;
		}
		return super.handle(query, request); // Passes control to the next handler in the chain
	}
}

/**
 * DateFilter extends Handler to specifically handle filtering by date range.
 */
class DateFilter extends Handler {
	/**
	 * Handles adding a date range filter to the query, if both fromDate and toDate are specified.
	 * @param {Object} query - The MongoDB query object to be modified.
	 * @param {Object} request - The request object containing the date range filters.
	 * @returns
	 */
	handle(query, request) {
		if (request.fromDate && request.toDate) {
			const fromDate = new Date(request.fromDate);
			const toDate = new Date(request.toDate);
			toDate.setDate(toDate.getDate() + 1); // Include all events on the end date

			query.date = {
				$gte: fromDate, // Greater than or equal to the start of the from date
				$lt: toDate, // Less than the start of the day after the to date
			};
		}
		return super.handle(query, request); // Passes control to the next handler in the chain
	}
}

// Export the specific filter handlers for use in the application
module.exports = { GenreFilter, DateFilter };
