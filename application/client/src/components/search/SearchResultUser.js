/* This file holds the component which shows a single row for a matched user in the Search page, when searching for users.
 * Clicking on the component takes the user to the clicked on user's profile page. */

import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { getRoleDescription } from '../Dropdowns';

export default function UserRow(props) {
    const { thumbnail, fullName, role, userId } = props;
    const navigate = useNavigate();

    return (
        <Row className="searched-user-row-component" onClick={() => navigate(`/user/${userId}`)}>
            <Col className="user-details-col">
                <Row className="thumbnail-name-row">
                    {/* Profile Picture Thumbnail Column */}
                    <Col className="profile-picture-thumbnail-col" md="auto">
                        <img className="profile-picture-thumbnail" src={`/${thumbnail}`} width="55" height="55"
                            alt="pfp thumbnail"
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