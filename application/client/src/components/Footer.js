/* This file holds the footer of our application. The footer is always visible to all users.
 * It contains helpful but not frequently visited links. */

import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <Container className='footer-component' fluid>
            <div className='content'>
                <span className='footer-text'>© 2022 Gatormmunity</span>

                <Link className='footer-link' to='/terms-of-service'>Terms</Link>
                <Link className='footer-link' to='/privacy-policy'>Privacy</Link>
                <Link className='footer-link' to='/about-us'>About</Link>
                <Link className="footer-link" to="/contact-us">Contact Us</Link>
                <Link className='footer-link' to='/help'>Help</Link>
            </div>
        </Container>
    );
}