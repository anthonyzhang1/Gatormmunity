import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

export default function UserRow(props) {
    const { fullName, profilePicturePath, profilePictureThumbnailPath, role, joinDate } = props;
    let roleString = ""; // the name of the role

    // get the name of the role given the role number
    switch (role) {
        case 0:
            roleString = "Unapproved User";
            break;
        case 1:
            roleString = "Approved User";
            break;
        case 2:
            roleString = "Moderator";
            break;
        case 3:
            roleString = "Administrator";
            break;
        default:
            roleString = "Invalid Role";
    }

    /** For M2 only: Alert the user if they click on a button that should redirect them to a page that is not the home page. */
    function M2RedirectAlert() {
        alert("You clicked on a link that will take you to another page. That page will be implemented in Milestone 3!");
    }

    return (
        <Row className="search-user-row-component">
            {/* Profile Picture */}
            <Col className="profile-picture-col" md="auto">
                <Link to='#' onClick={() => window.open(profilePicturePath)}>
                    <img className="profile-picture" src={profilePicturePath} alt="profile" width="225" height="225" />
                </Link>
            </Col>

            <Col className="user-details-col">
                <Row className="thumbnail-name-row">
                    {/* Profile Picture Thumbnail */}
                    <Col className="profile-picture-thumbnail-col" md="auto">
                        <Link to='#' onClick={M2RedirectAlert}>
                            <img className="profile-picture-thumbnail" src={profilePictureThumbnailPath}
                                alt="profile thumbnail" width="50" height="50"
                            />
                        </Link>
                    </Col>

                    {/* Full Name */}
                    <Col className="full-name-col">
                        <Link to='#' className="full-name-link" onClick={M2RedirectAlert}>
                            {fullName}
                        </Link>
                    </Col>
                </Row>

                {/* Role */}
                <Row className="role-row">
                    <p className="role-string">{roleString}</p>
                </Row>

                {/* Join Date */}
                <Row className="join-date-row">
                    <p>Member Since: {new Date(joinDate).toLocaleDateString()}</p>
                </Row>
            </Col>
        </Row>
    );
}