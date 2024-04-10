import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import EventsList from "./components/EventList";
import UserProfile from "./components/HomePage";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import AboutUs from "./components/AboutUs";

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
				<Route path="/" element={<LandingPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/profile" element={<UserProfile />} />
				<Route path="/events" element={<EventsList />} />
				<Route path="/about" element={<AboutUs />} />
			</Routes>
		</div>
	);
};

export default App;

// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./components/Login";
// import TopArtists from "./components/TopArtists";
// import EventsList from "./components/EventList";
// import UserProfile from "./components/UserProfile";
// import ProtectedRoute from "./components/ProtectedRoute";

// const App = () => {
// 	return (
// 		<div>
// 			<Routes>
// 				<Route path="/" element={<Login />} />
// 				<Route
// 					path="/profile"
// 					element={
// 						<ProtectedRoute>
// 							<UserProfile />
// 						</ProtectedRoute>
// 					}
// 				/>
// 				<Route
// 					path="/top-artists"
// 					element={
// 						<ProtectedRoute>
// 							<TopArtists />
// 						</ProtectedRoute>
// 					}
// 				/>
// 				<Route
// 					path="/events"
// 					element={
// 						<ProtectedRoute>
// 							<EventsList />
// 						</ProtectedRoute>
// 					}
// 				/>
// 			</Routes>
// 		</div>
// 	);
// };

// export default App;
