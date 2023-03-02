import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

/** For M2 only: Alert the user if they click on a button that should redirect them to a page that is not the home page. */
function M2RedirectAlert() {
    alert("You clicked on a button that will take you to another page. That page will be implemented in Milestone 3!");
}

/** The footer of our application. */
export default function Footer() {
    return (
        <Container fluid className='footer-component'>
            <Row>
                {/* The footer's logo */}
                <Col md='auto' className='footer-logo'>
                    <Link to='/'>
                        <img src="images/assets/gatorFrontLogo.png" width="45" height="45" alt="footer logo" />
                    </Link>
                </Col>

                {/* Copyright */}
                <Col md='auto'>© 2022 Gatormmunity</Col>

                {/* Terms of Service Link */}
                <Col md='auto'>
                    <Link to='#' className='footer-link' onClick={M2RedirectAlert}>Terms of Service</Link>
                </Col>

                {/* Privacy Policy Link */}
                <Col md='auto'>
                    <Link to='#' className='footer-link' onClick={M2RedirectAlert}>Privacy Policy</Link>
                </Col>

                {/* About Us Link */}
                <Col md='auto'>
                    <Link to='#' className='footer-link' onClick={M2RedirectAlert}>About Us</Link>
                </Col>

                {/* Contact Us Link */}
                <Col md='auto'>
                    <Link to='#' className='footer-link' onClick={M2RedirectAlert}>Contact Us</Link>
                </Col>
            </Row>
        </Container>
    );
}