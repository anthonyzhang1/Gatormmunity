/* This file handles the display of the Home page, which is what every person will first see upon visiting our website.
 * The page is accessible by clicking the logo in the navbar. */

import { useContext } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App.js';

export default function Home() {
    const userSession = useContext(UserContext); // the user's session data
    const navigate = useNavigate();

    if (!userSession) return; // wait for fetch
    else return (
        <div className="home-page">
            {/* This div contains the top half of our home page, i.e. the one with the background color */}
            <div className="slogan-div">
                <img className="slogan-image" src="/images/assets/sloganText.png" alt="slogan" height="200" width="700" />
                <p className="slogan-body-text">San Francisco State University's best trading/social networking service.</p>

                {/* Show the registration prompt if the user is not logged in. */}
                {!userSession.isLoggedIn &&
                    <Button className='slogan-register-button default-button-color' onClick={() => navigate('/register')}>
                        Join Us
                    </Button>
                }
            </div>

            <h1 className="features-container-title">Gatormmunity's Features</h1>

            {/* This is for the bottom half of our home page, where all of our features are listed.
              * Each feature has its own box. */}
            <Container fluid className="features-container">
                <Row className="features-row-1">
                    {/* Forums */}
                    <Col className="features-col-forums features-box">
                        <h3 className="feature-title">Forums</h3>
                        <p className="feature-body">
                            Meet students, alumni, and faculty in the forums and find events to participate in.
                            <br /><br />
                        </p>
                    </Col>

                    {/* Marketplace */}
                    <Col className="features-col-marketplace features-box">
                        <h3 className="feature-title">Marketplace</h3>
                        <p className="feature-body">
                            Buy and sell goods and services with others.
                        </p>
                    </Col>

                    {/* Groups */}
                    <Col className="features-col-groups features-box">
                        <h3 className="feature-title">Groups</h3>
                        <p className="feature-body">
                            Join groups and talk in your group's exclusive forum and chat room!
                        </p>
                    </Col>
                </Row>

                <Row className="features-row-2">
                    {/* Gator Chat */}
                    <Col className="features-col-gator-chat features-box">
                        <h3 className="feature-title">Live Chat</h3>
                        <p className="feature-body">
                            Chat with all of Gatormmunity's users in real-time in the Gator Chat chat room.
                            <br /><br />
                        </p>
                    </Col>

                    {/* Direct Messaging */}
                    <Col className="features-col-direct-messaging features-box">
                        <h3 className="feature-title">Direct Messaging</h3>
                        <p className="feature-body">
                            Have private conversations with others in real-time!
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}