import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../api/client";

const ProtectedRoute = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		fetch(`${baseUrl}`, { credentials: "include" })
			.then((response) => {
				if (response.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			})
			.finally(() => setIsLoading(false));
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
