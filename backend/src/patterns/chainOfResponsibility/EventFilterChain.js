class Handler {
	constructor() {
		this.nextHandler = null;
	}

	setNext(handler) {
		this.nextHandler = handler;
		return handler;
	}

	handle(request) {
		if (this.nextHandler) {
			return this.nextHandler.handle(request);
		} else {
			throw new Error("End of chain reached without processing request");
		}
	}
}

class GenreFilter extends Handler {
	handle(request) {
		if (request.genre) {
			// Process request based on genre
			console.log(`Filtering events by genre: ${request.genre}`);
			// Assuming the request is an object with an events array:
			request.events = request.events.filter(
				(event) => event.genre === request.genre
			);
		}
		return super.handle(request);
	}
}

class DateFilter extends Handler {
	handle(request) {
		if (request.date) {
			// Process request based on date
			console.log(`Filtering events by date: ${request.date}`);
			request.events = request.events.filter(
				(event) => event.date === request.date
			);
		}
		return super.handle(request);
	}
}

// Usage
const genreFilter = new GenreFilter();
const dateFilter = new DateFilter();

genreFilter.setNext(dateFilter);

// Example request object
const request = {
	genre: "Rock",
	date: "2023-09-12",
	events: [
		//... array of event objects
	],
};

// Start the processing chain
try {
	genreFilter.handle(request);
	console.log("Filtered events:", request.events);
} catch (error) {
	console.error(error.message);
}
