/* This file is used to import all of our CSS files and pages. The pages are displayed depending on what was entered
 * into the URL. Also, this file handles fetching the user's session data from the back end. */

import { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import * as questions from './components/help/Questions';

/* CSS Files */
import 'bootstrap/dist/css/bootstrap.css'; // bootstrap
import './css/Administration.css';
import './css/AboutMe.css';
import './css/AboutUs.css';
import './css/App.css';
import './css/ContactUs.css';
import './css/CreatePages.css';
import './css/Dashboard.css';
import './css/Forums.css';
import './css/GroupHome.css';
import './css/GroupMembers.css';
import './css/Help.css';
import './css/Home.css';
import './css/Login.css';
import './css/Marketplace.css';
import './css/Messaging.css';
import './css/PageNotFound.css';
import './css/PrivacyPolicy-ToS.css';
import './css/Registration.css';
import './css/Search.css';
import './css/UserGroups.css';
import './css/UserProfile.css';
import './css/ViewListing.css';
import './css/ViewThread.css';

/* Components that will be used on every page of our site. */
import Footer from './components/Footer';
import NavBar from './components/NavBar';

/* The main pages on our site. */
import AboutUs from './pages/AboutUs';
import Administration from './pages/Administration';
import Chat from './pages/Chat';
import ContactUs from './pages/ContactUs';
import CreateGroup from './pages/CreateGroup';
import CreateGroupThread from './pages/CreateGroupThread';
import CreateListing from './pages/CreateListing';
import CreateThread from './pages/CreateThread';
import Dashboard from './pages/Dashboard';
import GatormmunityForums from './pages/GatormmunityForums';
import GroupForums from './pages/GroupForums';
import GroupHome from './pages/GroupHome';
import GroupMemberPage from './pages/GroupMembers';
import Help from './pages/Help';
import Home from './pages/Home.js';
import Inbox from './pages/Inbox';
import JoinGroup from './pages/JoinGroup';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import PageNotFound from './pages/PageNotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Registration from './pages/Registration';
import Search from './pages/Search';
import TermsOfService from './pages/TermsOfService';
import UsersGroups from './pages/UsersGroups';
import UserProfile from "./pages/UserProfile";
import ViewListing from './pages/ViewListing';
import ViewThread from './pages/ViewThread';

/* The individual about me pages. */
import AboutAnthony from './pages/about/AboutAnthony.js';
import AboutFlorian from './pages/about/AboutFlorian.js';
import AboutJose from './pages/about/AboutJose.js';
import AboutMarwan from './pages/about/AboutMarwan.js';
import AboutMohamed from './pages/about/AboutMohamed.js';

/* The individual help answer pages. */
import CannotLogin from './pages/help/CannotLogin';
import GroupMemberManagement from './pages/help/GroupMemberManagement';
import GroupPurpose from './pages/help/GroupPurpose';
import JoinGroupHelp from './pages/help/JoinGroup';
import HowToCreateListing from './pages/help/HowToCreateListing';
import HowToSearch from './pages/help/HowToSearch';
import MeetingBuyerSeller from './pages/help/MeetingBuyerSeller';
import MessageUser from './pages/help/MessageUser';
import Report from './pages/help/Report';
import WhatAreThreads from './pages/help/WhatAreThreads';
import WhichForumCategory from './pages/help/WhichForumCategory';

/** Contains the user's session data which we can access from anywhere in our application. */
export const UserContext = createContext();

export default function App() {
    const [userSessionData, setUserSessionData] = useState(null); // stores the user's session data from the back end

    /** Asks the back end if the user is logged in and save the returned user's session data. */
    function getUserAuthentication() {
        fetch('/api/users/check-if-authenticated')
            .then(res => res.json())
            .then(data => setUserSessionData(data))
            .catch(console.log());
    }

    /* Asks the back end if the user is logged in upon loading a page. */
    useEffect(() => getUserAuthentication(), []);

    return (
        <div className="app">
            {/* Have the user session data be accessible for all pages and components */}
            <UserContext.Provider value={userSessionData}>
                <NavBar />

                {/* Pages */}
                <Routes>
                    {/* Navbar Left Routes */}
                    <Route path='/' element={<Home />} />
                    <Route path='/forums' element={<GatormmunityForums />} />
                    <Route path='/marketplace' element={<Marketplace />} />
                    <Route path='/groups' element={<UsersGroups />} />
                    <Route path='/chat' element={<Chat />} />
                    <Route path='/inbox' element={<Inbox />} />
                    <Route path='/admin' element={<Administration />} />

                    {/* Navbar Right Routes */}
                    <Route path='/search' element={<Search />} />
                    <Route path='/search/:searchTerms' element={<Search />} />
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Registration />} />

                    {/* Create routes */}
                    <Route path='/create-listing' element={<CreateListing />} />
                    <Route path='/create-group' element={<CreateGroup />} />
                    <Route path='/create-group-thread/:groupId' element={<CreateGroupThread />} />
                    <Route path='/create-thread' element={<CreateThread />} />

                    {/* Routes with params */}
                    <Route path='/user/:userId' element={<UserProfile />} />
                    <Route path='/listing/:listingId' element={<ViewListing />} />
                    <Route path='/thread/:threadId' element={<ViewThread />} />
                    <Route path='/join-group/:groupId/:joinCode' element={<JoinGroup />} />
                    <Route path='/group/:groupId' element={<GroupHome />} />
                    <Route path='/group-members/:groupId' element={<GroupMemberPage />} />
                    <Route path='/group-forums/:groupId' element={<GroupForums />} />

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
                    <Route path={questions.groupMemberManagement.answerLink} element={<GroupMemberManagement />} />
                    <Route path={questions.groupPurpose.answerLink} element={<GroupPurpose />} />
                    <Route path={questions.howToCreateListing.answerLink} element={<HowToCreateListing />} />
                    <Route path={questions.howToSearch.answerLink} element={<HowToSearch />} />
                    <Route path={questions.joinGroup.answerLink} element={<JoinGroupHelp />} />
                    <Route path={questions.meetingBuyerSeller.answerLink} element={<MeetingBuyerSeller />} />
                    <Route path={questions.messageUser.answerLink} element={<MessageUser />} />
                    <Route path={questions.report.answerLink} element={<Report />} />
                    <Route path={questions.whatAreThreads.answerLink} element={<WhatAreThreads />} />
                    <Route path={questions.whichForumCategory.answerLink} element={<WhichForumCategory />} />

                    {/* Page Not Found page */}
                    <Route path='*' element={<PageNotFound />} />
                </Routes>

                <Footer />
            </UserContext.Provider>
        </div>
    );
}