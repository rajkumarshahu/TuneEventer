import React from "react";

const Login = () => {
	const handleLogin = () => {
		// Redirects the user to the backend /login endpoint
		window.location.href = "http://localhost:4000/login";
	};

	return (
		<div>
			<button onClick={handleLogin}>Log in with Spotify</button>
		</div>
	);
};

export default Login;