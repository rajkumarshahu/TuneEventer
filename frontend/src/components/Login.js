import React from "react";

const Login = () => {
	const handleLogin = () => {
		// Redirects the user to the backend /login endpoint
		// window.location.href = "https://tuneeventer-backend.onrender.com/login";
		window.location.href = "http://localhost:4000/auth/login";
	};

	return (
		<div>
			<button onClick={handleLogin}>Log in with Spotify</button>
		</div>
	);
};

export default Login;
