import React, { useEffect, useState } from "react";

const TopArtists = () => {
	const [topArtists, setTopArtists] = useState(null);
	// const [loading, setLoading] = useState(true); // Add loading state

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const accessToken = queryParams.get("access_token");

		const fetchTopArtists = async () => {
			try {
				const response = await fetch(
					"http://localhost:4000/spotify/top-artists",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to fetch top artists");
				}

				const data = await response.json();
				setTopArtists(data.items);
				// setLoading(false);
			} catch (error) {
				console.error("Error:", error);
				// setLoading(false);
			}
		};

		if (accessToken) {
			fetchTopArtists();
		}
	}, []);

	// if (loading) {
	// 	return <div>Loading top artists...</div>;
	// }

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
