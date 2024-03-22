// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import TopArtists from "./components/TopArtists";

const App = () => {
	const navigate = useNavigate();

	useEffect(() => {
		// Parse the URL for an access token parameter
		const queryParams = new URLSearchParams(window.location.search);
		const accessToken = queryParams.get("access_token");

		// If an access token exists in the URL, navigate to the TopArtists component
		if (accessToken) {
			// Optionally store the access token in a state management solution
			navigate("/top-artists"); // Navigate to the TopArtists route
		}
	}, [navigate]);

	return (
		<div>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/top-artists" element={<TopArtists />} />
			</Routes>
		</div>
	);
};

export default App;
