import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/** The footer of our application. */
export default function Footer() {
    return (
        <Container fluid className='footer-component'>
            <Row>
                {/* Copyright */}
                <Col md='auto'>© 2022 Gatormmunity</Col>

                {/* Terms of Service Link */}
                <Col md='auto'>
                    <Link to='/terms-of-service' className='footer-link'>Terms</Link>
                </Col>

                {/* Privacy Policy Link */}
                <Col md='auto'>
                    <Link to='/privacy-policy' className='footer-link'>Privacy</Link>
                </Col>

                {/* About Us Link */}
                <Col md='auto'>
                    <Link to='/about-us' className='footer-link'>About</Link>
                </Col>

				{/* Contact Us Link */}
				<Col md='auto'>
					<Link to="/contact-us" className="footer-link">Contact Us</Link>
				</Col>

				{/* Help Page Link */}
                <Col md='auto'>
                    <Link to='/help' className='footer-link'>Help</Link>
                </Col>
			</Row>
		</Container>
	);
}