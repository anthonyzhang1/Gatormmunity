import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { getRoleDescription } from './SearchDropdowns';
import { mockUsers } from '../M3MockData';

export default function UserRow(props) {
    const { thumbnail, fullName, role } = props;
    const navigate = useNavigate();
    let user_id = Math.floor(Math.random() * mockUsers.length) + 100; // link to random mock user's profile page

    return (
        <Row className="searched-user-row-component" onClick={() => { navigate(`/user/${user_id}`) }}>
            <Col className="user-details-col">
                <Row className="thumbnail-name-row">
                    {/* Profile Picture Thumbnail Column */}
                    <Col className="profile-picture-thumbnail-col" md="auto">
                        <img className="profile-picture-thumbnail" src={thumbnail}
                            alt="profile thumbnail" width="55" height="55"
                        />
                    </Col>

                    {/* Full Name and Role Column */}
                    <Col className="full-name-col">
                        <p className='full-name'>{fullName}</p>
                        <p className='role'>{getRoleDescription(role)}</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
}