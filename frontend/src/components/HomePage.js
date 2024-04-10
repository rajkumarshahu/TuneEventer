import React, { useState, useEffect } from "react";
import {
	Typography,
	Container,
	Button,
	AppBar,
	Toolbar,
	Paper,
	Box,
	Grid,
	Link,
	CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { baseUrl } from "../api/client";

const UserProfile = () => {
	const [userProfile, setUserProfile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${baseUrl}/api/profile`, { credentials: "include" })
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => setUserProfile(data))
			.catch((e) => {
				setError(e);
				console.error("Error fetching user profile:", e);
			})
			.finally(() => setLoading(false));
	}, []);

	if (isLoading) {
		return (
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
		);
	}
	if (error) return <div>Error fetching profile: {error.message}</div>;
	if (!userProfile) return <div>No profile data found.</div>;

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
				<Paper sx={{ p: 2, mb: 2 }}>
					<Typography variant="h5">User Profile</Typography>
					<Typography>
						<strong>Name:</strong> {userProfile.displayName}
					</Typography>
					<Typography>
						<strong>Email:</strong> {userProfile.email}
					</Typography>
				</Paper>
			</Container>
			<Box
				onClick={() => navigate("/events")}
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "10vh",
				}}
			>
				<Button variant="contained">Check and filter your events</Button>
			</Box>
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

export default UserProfile;
