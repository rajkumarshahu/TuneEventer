class Handler {
	constructor() {
		this.nextHandler = null;
	}

	setNext(handler) {
		this.nextHandler = handler;
		return handler; // Facilitates chaining
	}

	handle(query, request) {
		if (this.nextHandler) {
			return this.nextHandler.handle(query, request);
		}
	}
}

class GenreFilter extends Handler {
	handle(query, request) {
		if (request.genre) {
			console.log(`Adding genre filter to MongoDB query: ${request.genre}`);
			query.genre = request.genre;
		}
		return super.handle(query, request);
	}
}

class DateFilter extends Handler {
	handle(query, request) {
		//  check for fromDate and toDate
		if (request.fromDate && request.toDate) {
			console.log(
				`Adding date range filter to MongoDB query: ${request.fromDate} to ${request.toDate}`
			);

			const fromDate = new Date(request.fromDate);
			const toDate = new Date(request.toDate);
			toDate.setDate(toDate.getDate() + 1); // the toDate to include all events on the end date

			query.date = {
				$gte: fromDate, // Greater than or equal to the start of the from date
				$lt: toDate, // Less than the start of the day after the to date
			};
		}
		return super.handle(query, request);
	}
}

module.exports = { GenreFilter, DateFilter };
