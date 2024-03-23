import React, { useEffect, useState } from "react";

const TopArtists = () => {
	const [topArtists, setTopArtists] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const getSession = async () => {
			try {
				const sessionResponse = await fetch(
					"http://localhost:4000/api/session",
					{
						credentials: "include",
					}
				);

				if (!sessionResponse.ok) {
					throw new Error("Session check failed");
				}
				const data = await sessionResponse.json();
				console.log("Session Data:", data);

				const { isAuthenticated, accessToken } = data;

				if (!isAuthenticated || !accessToken) {
					throw new Error("Not authenticated or no access token available");
				}
				return accessToken;
			} catch (error) {
				console.error("Error checking session:", error);
				setLoading(false);
				return null; // Return null explicitly on error
			}
		};

		const fetchTopArtists = async (accessToken) => {
			try {
				if (accessToken) {
					const response = await fetch(
						"http://localhost:4000/spotify/top-artists",
						{
							method: "GET",
							credentials: "include",
						}
					);

					if (!response.ok) {
						throw new Error("Failed to fetch top artists");
					}

					const data = await response.json();
					setTopArtists(data.items);
					setLoading(false);
				} else {
					throw new Error("Could not authenticate");
				}
			} catch (error) {
				console.error("Error fetching top artists:", error);
				setLoading(false);
			}
		};

		getSession().then((accessToken) => {
			if (accessToken) {
				fetchTopArtists(accessToken);
			} else {
				setLoading(false);
			}
		});
	}, []);

	if (loading) {
		return <div>Loading top artists...</div>;
	}

	if (!topArtists) {
		return <div>No top artists data available.</div>;
	}

	return (
		<div>
			<h1>Top Artists</h1>
			<ul>
				{topArtists.map((artist) => (
					<li key={artist.id}>{artist.name}</li>
				))}
			</ul>
		</div>
	);
};

export default TopArtists;
