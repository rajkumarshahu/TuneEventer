import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Grid,
	Paper,
	Container,
} from "@mui/material";

import { FaSpotify } from "react-icons/fa";

import { baseUrl } from "../api/client";

const LandingPage = () => {
	const handleLogin = () => {
		console.log("handleLogin called");
		window.location.href = ` ${baseUrl}/auth/login`;
	};

	return (
		<>
			<AppBar position="static" color="primary">
				<Toolbar>
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						TuneEventer
					</Typography>
					<Button onClick={handleLogin} color="inherit">
						Login
					</Button>
					{/*<Button color="inherit" href="/signup">
						Sign Up
    </Button>*/}
				</Toolbar>
			</AppBar>

			<Box
				sx={{
					backgroundImage:
						"url(https://static.wixstatic.com/media/10eae1_c0388d04e92c4e9180533cf98f891a24~mv2.jpg/v1/fill/w_772,h_468,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/B%26W%20Crowd.jpg)",
					backgroundSize: "cover",
					backgroundPosition: "center",
					height: "40vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					textAlign: "center",
					color: "white",
				}}
			>
				<Box>
					<Typography variant="h2" sx={{ mb: 2 }}>
						Discover Live Music Events Tailored Just For You
					</Typography>
					<Typography variant="body1" sx={{ mb: 3 }}>
						Connect with your Spotify account and let TuneEventer curate your
						concert experience.
					</Typography>
					<Button
						onClick={handleLogin}
						variant="contained"
						color="secondary"
						startIcon={<FaSpotify />}
						size="large"
						sx={{
							fontSize: "1.5rem",
							padding: "16px 32px",
							minWidth: "250px",
							height: "60px",
							borderRadius: "8px",
						}}
					>
						Connect with Spotify
					</Button>
				</Box>
			</Box>

			<Container sx={{ py: 5 }}>
				<Grid container spacing={5}>
					<Feature
						image="https://2.bp.blogspot.com/-Nc9YO_-F8yI/TcSIAB-nR-I/AAAAAAAAAGI/hPkuxqkqVcU/s1600/music-clipartMUSIC1.jpg"
						title="Personalized Recommendations"
						description="Get event suggestions based on your music taste."
					/>
					<Feature
						image="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Music-PNG/Musical_Notes_PNG_Transparent_Clipart.png?m=1657793472"
						title="Live Concerts"
						description="Discover live music happening around you and across the globe."
					/>
					<Feature
						image="https://previews.123rf.com/images/get4net/get4net2201/get4net220103460/179975692-play-the-music-from-one-touch-easy-access.jpg"
						title="Easy Access"
						description="Quickly find event details, locations, and purchase tickets."
					/>
				</Grid>
			</Container>
		</>
	);
};

const Feature = ({ image, title, description }) => {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Paper sx={{ p: 2, textAlign: "center" }}>
				<img
					src={image}
					alt={title}
					style={{ width: "80%", marginBottom: "1rem" }}
				/>
				<Typography variant="h5" component="h3" sx={{ mb: 1 }}>
					{title}
				</Typography>
				<Typography variant="body2">{description}</Typography>
			</Paper>
		</Grid>
	);
};

export default LandingPage;
