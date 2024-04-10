import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AppHeader = () => {
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
				<Typography variant="h4">Welcome to TuneEventer</Typography>
				<Typography>
					Discover events based on your Spotify preferences
				</Typography>
			</Box>
		</>
	);
};

export default AppHeader;
