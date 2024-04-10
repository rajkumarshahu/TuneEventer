# TuneEventer README

## Purpose

TuneEventer is designed to connect Spotify users with live music events that match their tastes, providing personalized event recommendations based on their listening preferences.

## Audience

Targeted at Spotify users and live music enthusiasts seeking events that closely align with their musical preferences.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- Git

### Installation

1. **Clone the repository:**

   - Use the `git clone` command followed by the repository URL.
   - Navigate to the `TuneEventer` directory after cloning.

2. **Set up the backend:**

   - Navigate to the backend directory.
   - Rename `config/config_copy.env` to `config/config.env` and update it with your MongoDB URI and Spotify API keys.
   - Install backend dependencies using `npm install`.
   - Start the backend server with `npm run dev`.

3. **Set up the frontend:**

   - Open a new terminal window and navigate to the frontend directory from the project root.
   - Install frontend dependencies using `npm install`.
   - Start the React development server with `npm start`.
   - The frontend should now be running on `http://localhost:3000`.

## Technologies Used

- **Backend:** Node.js, Express, MongoDB Atlas
- **Frontend:** React
- **APIs:** Spotify Web API, Ticketmaster API
- **Database:** MongoDB Atlas for storing user data and event preferences

## Features

- Spotify authentication to access user's music preferences
- Personalized live event recommendations based on the user's Spotify music taste
- Ability to filter events by genre and date
- User profile management

## Author

Raj Kumar Shahu
