import {Route, Routes} from 'react-router-dom';

/* CSS Files */
import 'bootstrap/dist/css/bootstrap.css'; // bootstrap CSS
import './css/AboutPage.css';
import './css/TeamHomePage.css';

/* The main pages on our site */
import TeamHomePage from './pages/TeamHomePage.js';

/* Our individual about me pages */
import AboutAnthony from './pages/about/AboutAnthony.js';
import AboutFlorian from './pages/about/AboutFlorian.js';
import AboutJose from './pages/about/AboutJose.js';
import AboutMarwan from './pages/about/AboutMarwan.js';
import AboutMohamed from './pages/about/AboutMohamed.js';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<TeamHomePage />} />

      <Route path='/about/anthony' element={<AboutAnthony />} />
      <Route path='/about/mohamed' element={<AboutMohamed />} /> 
      <Route path='/about/florian' element={<AboutFlorian />} />
      <Route path='/about/marwan' element={<AboutMarwan />} />
      <Route path='/about/jose' element={<AboutJose />} />
    </Routes>
  );
}