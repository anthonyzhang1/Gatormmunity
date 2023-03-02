import { useNavigate } from 'react-router-dom';

export default function AboutUsCard(props) {
    const { name, picture, aboutMePageLink } = props;
    const navigate = useNavigate();

    return (
        <div className="about-us-card-component" onClick={() => navigate(aboutMePageLink)}>
            <img className='my-image' src={picture} alt={name} />
            <h4 className='my-name'>{name}</h4>
        </div>
    )
}