import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
	const navigate = useNavigate();

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
				<Typography variant="h4">About TuneEventer</Typography>
				<Typography sx={{ mt: 2 }}>
					Connecting you with music events tailored to your taste.
				</Typography>
			</Box>
			<Container maxWidth="lg" sx={{ mt: 4 }}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Typography variant="h5" gutterBottom>
						Our Mission
					</Typography>
					<Typography>
						At TuneEventer, our mission is to help music lovers discover live
						events that resonate with their personal music preferences. By
						leveraging data from your Spotify account, we curate a list of
						upcoming concerts, festivals, and gigs that we think you'll love.
					</Typography>
				</Paper>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Typography variant="h5" gutterBottom>
						The Team
					</Typography>
					<Typography>
						We're a group of music enthusiasts and tech aficionados based in
						[Your Location]. Our diverse tastes in music and background in
						technology fuel our commitment to making live music more accessible
						and personalized for everyone.
					</Typography>
				</Paper>
			</Container>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "10vh",
				}}
			>
				<Button variant="contained" onClick={() => navigate("/events")}>
					Discover Events
				</Button>
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

export default AboutUs;
