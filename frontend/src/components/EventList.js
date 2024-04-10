import React, { useState, useEffect } from "react";
import {
	Typography,
	Box,
	Container,
	Paper,
	Grid,
	CircularProgress,
	TextField,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	AppBar,
	Toolbar,
	Button,
	Link,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { baseUrl } from "../api/client";
import { useNavigate } from "react-router-dom";

const EventsList = () => {
	const [events, setEvents] = useState([]);
	const [genres, setGenres] = useState([]);
	const [error, setError] = useState(null);
	const [selectedGenre, setGenre] = useState("");
	const [selectedFromDate, setFromDate] = useState("");
	const [selectedToDate, setToDate] = useState("");
	const [topSpotifyArtist, setTopSpotifyArtists] = useState("");
	const [isLoading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			setError(null);

			try {
				// Parallel fetching of events, genres, and top Spotify artists
				const responses = await Promise.all([
					fetch(
						`${baseUrl}/api/events?${new URLSearchParams({
							...(selectedGenre && { genre: selectedGenre }),
							...(selectedFromDate && { fromDate: selectedFromDate }),
							...(selectedToDate && { toDate: selectedToDate }),
						})}`
					),
					fetch(`${baseUrl}/api/genres`),
					fetch(`${baseUrl}/api/spotify-artists`),
				]);
				const hasError = responses.some((response) => !response.ok);
				if (hasError) {
					const errorResponse = responses.find((response) => !response.ok);
					throw new Error(`HTTP error! status: ${errorResponse.status}`);
				}

				const [eventsData, genresData, spotifyArtistsData] = await Promise.all(
					responses.map((response) => response.json())
				);
				setEvents(eventsData);
				setGenres(genresData);
				setTopSpotifyArtists(spotifyArtistsData);
			} catch (e) {
				console.error("Error fetching data:", e);
				setError(e);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [selectedGenre, selectedFromDate, selectedToDate]);

	const formatDate = (dateString) => {
		const date = parseISO(dateString);

		return format(date, "EEEE, MMMM d, yyyy");
	};

	const handleGenreChange = (event) => {
		setGenre(event.target.value);
	};

	const handleFromDateChange = (event) => {
		setFromDate(event.target.value);
	};

	const handleToDateChange = (event) => {
		setToDate(event.target.value);
	};

	const handleBackToEvents = () => {
		navigate("/home");
	};

	if (isLoading) {
		return (
			<>
				<Container
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "100vh",
					}}
				>
					<CircularProgress />
				</Container>
			</>
		);
	}

	if (error) return <div>Error fetching events: {error.message}</div>;
	if (!events.length)
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					marginTop: 4,
				}}
			>
				<Typography variant="h5" sx={{ mb: 2 }}>
					No events found.
				</Typography>
				<Button variant="contained" onClick={handleBackToEvents}>
					Go Back to Your Home Page
				</Button>
			</Box>
		);

	return (
		<>
			<AppBar position="static" sx={{ backgroundColor: "#333" }}>
				<Toolbar>
					<Typography variant="h6" sx={{ flexGrow: 1 }}>
						TuneEventer
					</Typography>
					<Button color="inherit" onClick={() => navigate("/")}>
						Home
					</Button>
					<Button color="inherit" onClick={() => navigate("/events")}>
						Events
					</Button>
					<Button color="inherit" onClick={() => navigate("/profile")}>
						Profile
					</Button>
					<Button color="inherit" onClick={() => navigate("/about")}>
						About
					</Button>
				</Toolbar>
			</AppBar>

			<Box
				sx={{
					backgroundColor: "#333",
					color: "white",
					textAlign: "center",
					p: 2,
				}}
			>
				<Typography variant="h4">Welcome to TuneEventer</Typography>
				<Typography>
					Discover events based on your Spotify preferences
				</Typography>
			</Box>
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				{/* Display top Spotify artist(s)*/}
				{topSpotifyArtist && (
					<Typography
						variant="h6"
						sx={{
							my: 1,
							textAlign: "center",
							fontWeight: "bold", // Makes the title text bold
						}}
					>
						Your Top Spotify Artists:
					</Typography>
				)}
				{topSpotifyArtist && (
					<Typography
						variant="body1"
						sx={{
							textAlign: "center",
						}}
					>
						{Array.isArray(topSpotifyArtist)
							? topSpotifyArtist.join(", ")
							: topSpotifyArtist}
					</Typography>
				)}
				<Typography
					variant="h5"
					sx={{
						my: 1,
						fontWeight: "bold",
						textAlign: "center",
					}}
				>
					Your Recommended Events
				</Typography>
				<Box
					sx={{
						marginBottom: 2,
						display: "flex",
						alignItems: "center",
						gap: 2,
					}}
				>
					<FormControl
						variant="standard"
						sx={{ m: 1, minWidth: 120, flexShrink: 1 }}
					>
						<InputLabel id="genre-select-label">Your Top Genre</InputLabel>
						<Select
							labelId="genre-select-label"
							id="genre-select"
							value={selectedGenre}
							onChange={handleGenreChange}
							label="Genre"
						>
							<MenuItem value="">
								<em>Any</em>
							</MenuItem>
							{genres.map((genre, index) => (
								<MenuItem key={index} value={genre}>
									{genre}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="From Date"
						type="date"
						value={selectedFromDate}
						onChange={handleFromDateChange}
						InputLabelProps={{ shrink: true }}
						sx={{ flexShrink: 1, flexGrow: 1, width: "auto" }}
					/>
					<TextField
						label="To Date"
						type="date"
						value={selectedToDate}
						onChange={handleToDateChange}
						InputLabelProps={{ shrink: true }}
						sx={{ flexShrink: 1, flexGrow: 1, width: "auto" }}
					/>
				</Box>

				<Grid container spacing={2}>
					{events.map((event) => (
						<Grid item xs={12} sm={6} md={4} key={event.id}>
							<Paper
								sx={{
									p: 2,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}
							>
								<Typography variant="h6">{event.name}</Typography>
								<Typography variant="h6">Genre: {event.genre}</Typography>
								<Typography variant="body2">
									{formatDate(event.date)}
								</Typography>
								{event.imageUrl && (
									<img
										src={event.imageUrl}
										alt={event.name}
										style={{ width: "100%", height: "auto", marginTop: "8px" }}
										onError={(e) => {
											e.target.onerror = null; // Prevent looping
											e.target.src = "path_to_default_image.jpg"; // Fallback image path
										}}
									/>
								)}

								{/* Display venue details */}
								{event.venue && (
									<Box sx={{ mt: 2, textAlign: "center" }}>
										<Typography variant="subtitle1">
											{event.venue.name}
										</Typography>
										{/*<Typography variant="body2">
											{event.venue.address.line1}
								</Typography>*/}
										<Typography variant="body2">{`${event.venue.city}, ${event.venue.state} ${event.venue.postalCode}`}</Typography>
										<Typography variant="body2">
											{event.venue.country}
										</Typography>
									</Box>
								)}
								<Link
									href={event.url}
									target="_blank"
									rel="noopener noreferrer"
									sx={{ mt: 1 }}
								>
									Event Details
								</Link>
							</Paper>
						</Grid>
					))}
				</Grid>
			</Container>

			<Box
				component="footer"
				sx={{
					backgroundColor: "#333",
					color: "white",
					mt: 8,
					py: 3,
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={3}>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								TuneEventer
							</Typography>
							<Typography>
								Discover your next unforgettable live music experience.
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								Quick Links
							</Typography>
							<Link
								href="#"
								onClick={() => navigate("/")}
								color="inherit"
								underline="hover"
							>
								Home
							</Link>
							<br />
							<Link
								href="#"
								onClick={() => navigate("/events")}
								color="inherit"
								underline="hover"
							>
								Events
							</Link>
							<br />
							<Link
								href="#"
								onClick={() => navigate("/profile")}
								color="inherit"
								underline="hover"
							>
								Profile
							</Link>
							<br />
							<Link
								href="#"
								onClick={() => navigate("/about")}
								color="inherit"
								underline="hover"
							>
								About Us
							</Link>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Typography variant="h6" gutterBottom>
								Contact Us
							</Typography>
							<Typography>Email: contact@tuneeventer.com</Typography>
						</Grid>
					</Grid>
				</Container>
			</Box>
		</>
	);
};

export default EventsList;
