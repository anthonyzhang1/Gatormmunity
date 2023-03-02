import { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as questions from './components/help/Questions';

/* CSS Files */
import 'bootstrap/dist/css/bootstrap.css'; // bootstrap
import './css/AboutMe.css';
import './css/AboutUs.css';
import './css/App.css';
import './css/Chat-Inbox.css';
import './css/ContactUs.css';
import './css/CreateGroup.css';
import './css/CreateListing.css';
import './css/CreateThread.css';
import './css/Dashboard.css';
import './css/Forums.css';
import './css/GroupHome.css';
import './css/GroupMembers.css';
import './css/Help.css';
import './css/Home.css';
import './css/Login.css';
import './css/Marketplace.css';
import './css/PageNotFound.css';
import './css/PrivacyPolicy-ToS.css';
import './css/Registration.css';
import './css/Search.css';
import './css/UserGroups.css';
import './css/UserProfile.css';
import './css/ViewListing.css';
import './css/ViewThread.css';

/* Components that will be used on every page of our site */
import Footer from './components/Footer';
import NavBar from './components/NavBar';

/* The main pages on our site */
import AboutUs from './pages/AboutUs';
import Chat from './pages/Chat';
import ContactUs from './pages/ContactUs';
import CreateGroup from './pages/CreateGroup';
import CreateListing from './pages/CreateListing';
import CreateThread from './pages/CreateThread';
import Dashboard from './pages/Dashboard';
import GatormmunityForums from './pages/GatormmunityForums';
import GroupCreateThread from './pages/GroupCreateThread';
import GroupForums from './pages/GroupForums';
import GroupHome from './pages/GroupHome';
import GroupMemberPage from './pages/GroupMembers';
import Help from './pages/Help';
import Home from './pages/Home.js';
import Inbox from './pages/Inbox';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import PageNotFound from './pages/PageNotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Registration from './pages/Registration';
import Search from './pages/Search';
import TermsOfService from './pages/TermsOfService';
import UserGroups from './pages/UserGroups';
import UserProfile from "./pages/UserProfile";
import ViewListing from './pages/ViewListing';
import ViewThread from './pages/ViewThread';

/* The individual about me pages */
import AboutAnthony from './pages/about/AboutAnthony.js';
import AboutFlorian from './pages/about/AboutFlorian.js';
import AboutJose from './pages/about/AboutJose.js';
import AboutMarwan from './pages/about/AboutMarwan.js';
import AboutMohamed from './pages/about/AboutMohamed.js';

/* The individual help answer pages */
import CannotLogin from './pages/help/CannotLogin';
import GroupPurpose from './pages/help/GroupPurpose';
import JoinGroup from './pages/help/JoinGroup';
import MeetingBuyerSeller from './pages/help/MeetingBuyerSeller';
import MessageUser from './pages/help/MessageUser';
import ReportUser from './pages/help/ReportUser';
import WhichForumCategory from './pages/help/WhichForumCategory';

/** Contains the user's session data which we can access from anywhere in our application. */
export const UserContext = createContext();

export default function App() {
	const [userSessionData, setUserSessionData] = useState(null); // stores the user's session data

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
					{/* Navbar left routes */}
					<Route path='/' element={<Home />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/forums' element={<GatormmunityForums />} />
					<Route path='/marketplace' element={<Marketplace />} />
					<Route path='/groups' element={<UserGroups />} />
					<Route path='/chat' element={<Chat />} />
					<Route path='/inbox' element={<Inbox />} />

					{/* Navbar right routes */}
					<Route path='/search' element={<Search />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Registration />} />

					{/* Create routes */}
					<Route path='/create-listing' element={<CreateListing />} />
					<Route path='/create-group' element={<CreateGroup />} />
					<Route path='/create-thread' element={<CreateThread />} />

					{/* Routes with params */}
					<Route path='/user/:userId' element={<UserProfile />} />
					<Route path='/listing/:listingId' element={<ViewListing />} />
					<Route path='/thread/:threadId' element={<ViewThread />} />
					<Route path='/group/:groupId' element={<GroupHome />} />
					<Route path='/group-members/:groupId' element={<GroupMemberPage />} />
					<Route path='/group-forums/:groupId' element={<GroupForums />} />
					<Route path='/group-create-thread/:groupId' element={<GroupCreateThread />} />

					{/* About Me/Us Pages */}
					<Route path='/about-us/' element={<AboutUs />} />
					<Route path='/about-us/anthony' element={<AboutAnthony />} />
					<Route path='/about-us/mohamed' element={<AboutMohamed />} />
					<Route path='/about-us/florian' element={<AboutFlorian />} />
					<Route path='/about-us/marwan' element={<AboutMarwan />} />
					<Route path='/about-us/jose' element={<AboutJose />} />

					{/* Other footer pages */}
					<Route path='/terms-of-service' element={<TermsOfService />} />
					<Route path='/privacy-policy' element={<PrivacyPolicy />} />
					<Route path='/contact-us' element={<ContactUs />} />
					<Route path='/help' element={<Help />} />

					{/* Help Answer Pages */}
					<Route path={questions.cannotLogin.answerLink} element={<CannotLogin />} />
					<Route path={questions.groupPurpose.answerLink} element={<GroupPurpose />} />
					<Route path={questions.joinGroup.answerLink} element={<JoinGroup />} />
					<Route path={questions.meetingBuyerSeller.answerLink} element={<MeetingBuyerSeller />} />
					<Route path={questions.messageUser.answerLink} element={<MessageUser />} />
					<Route path={questions.reportUser.answerLink} element={<ReportUser />} />
					<Route path={questions.whichForumCategory.answerLink} element={<WhichForumCategory />} />

					<Route path='*' element={<PageNotFound />} />
				</Routes>

				<Footer />
			</UserContext.Provider>
		</div>
	);
}