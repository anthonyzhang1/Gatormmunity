import {useNavigate} from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function TeamHomePage() {
    const navigate = useNavigate();

    return (
        <div className="team-home-page-page">
            <h1>
                Software Engineering Class SFSU <br />
                Fall 2022 <br />
                Section 5 <br />
                Team 7
            </h1>

            {/* Buttons to each of our respective about me pages. */}
            <Button variant='outline-primary' className='about-me-link' onClick={() => navigate('/about/anthony')}>
                Anthony Zhang
            </Button>
            <Button variant='outline-primary' className='about-me-link' onClick={() => navigate('/about/mohamed')}>
                Mohamed Sharif
            </Button>
            <Button variant='outline-primary' className='about-me-link' onClick={() => navigate('/about/florian')}>
                Florian Cartozo
            </Button>
            <Button variant='outline-primary' className='about-me-link' onClick={() => navigate('/about/marwan')}>
                Marwan Alnounou
            </Button>
            <Button variant='outline-primary' className='about-me-link' onClick={() => navigate('/about/jose')}>
                Jose Lopez
            </Button>
        </div>
    );
}