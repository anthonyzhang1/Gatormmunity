/* This file handles the display of the Page Not Found page, which appears if the user enters an invalid URL.
 * The user can return to the home page by pressing the logo or the "Go Home" button. */

import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
    const navigate = useNavigate();

    return (
        <div className="page-not-found-page">
            <h1 className="page-title">PAGE NOT FOUND</h1>
            <p>Sorry, but this page doesn't exist! Click on the logo or the button below to go back to the home page!</p>

            <img className='logo' src='/images/assets/gatorFrontLogo.png' alt='gator logo' width="150" height='150'
                onClick={() => navigate('/')}
            />

            <Button className='home-button default-button-color' onClick={() => navigate('/')}>Go Home</Button>
        </div>
    );
}