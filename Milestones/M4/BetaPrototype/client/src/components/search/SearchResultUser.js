import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { getRoleDescription } from './SearchDropdowns';

export default function UserRow(props) {
    const { thumbnail, fullName, role, userId } = props;
    const navigate = useNavigate();

    return (
        <Row className="searched-user-row-component" onClick={() => { navigate(`/user/${userId}`) }}>
            <Col className="user-details-col">
                <Row className="thumbnail-name-row">
                    {/* Profile Picture Thumbnail Column */}
                    <Col className="profile-picture-thumbnail-col" md="auto">
                        <img className="profile-picture-thumbnail" src={`/${thumbnail}`}
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