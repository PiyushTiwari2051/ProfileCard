# Premium Profile Card Web Application

A glassmorphic, responsive, and dark-theme developer profile card application built with React, Node.js + Express, and flat-file database storage.

## Backend Setup & Run

The backend is an Express server configured to serve profile data, handle updates, and auto-seed flat-file database storage on initial run.
To run the server:
1. Navigate to the backend folder: `cd profile-app/backend`
2. Install dependencies: `npm install`
3. Run the development server: `npm start` (runs on `http://localhost:5000`)

## Frontend Setup & Run

The frontend is a React application built with functional hooks, vanilla CSS, and standard routers.
To run the frontend:
1. Navigate to the frontend folder: `cd profile-app/frontend`
2. Install dependencies: `npm install`
3. Run the dev server: `npm start` or `npm run dev` (runs on `http://localhost:3000` or custom port)

## Directory Structure

- **`profile-app/backend`**: Contains `server.js` for endpoints (`GET` and `PUT` `/api/profile`), `package.json` for server configurations, and `profile.json` which persists the profile data.
- **`profile-app/frontend`**: Holds the React client application split into modular components, api connectors, state hooks, routers, and global vanilla CSS styles.
