import { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

/* CSS Files */
import 'bootstrap/dist/css/bootstrap.css';
import './css/App.css';
import './css/Home.css';

/* The main pages on our site */
import Home from './pages/Home.js';

/* Components that will be used on every page of our site */
import NavBar from './components/NavBar.js';
import Footer from './components/Footer.js';

/** Contains the user's session data which we can access from anywhere in our application. */
export const UserContext = createContext();

export default function App() {
	// stores the user's session data
	const [userSessionData, setUserSessionData] = useState(null);

	/**
	 * Asks the back end if the user is logged in via a GET request.
	 * 
	 * The front end expects:
	 * If the user is logged in:
	 *     status: "success",
	 *     userSessionData: Object with the user's session data.
	 * If the user is not logged in:
	 *     status: "success",
	 *     userSessionData: `null`.
	 */
	async function getUserAuthentication() {
		await fetch('/api/users/check-if-authenticated')
			.then(res => res.json())
			.then(data => { setUserSessionData(data.userSessionData); }) // store what the back end sent to us
			.catch(console.log());
	}

	// Asks the back end if the user is logged in upon loading a page
	useEffect(() => {
		getUserAuthentication();
	}, []);

	return (
		<div className="app">
			{/* Have the user session data be accessible for all pages and components */}
			<UserContext.Provider value={userSessionData}>
				<NavBar />

				{/* Pages */}
				<Routes>
					<Route path='/' element={<Home />} />
				</Routes>

				<Footer />
			</UserContext.Provider>
		</div>
	);
}