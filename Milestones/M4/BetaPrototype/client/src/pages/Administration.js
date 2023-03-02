import { useContext, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import UnapprovedUserRow from '../components/UnapprovedUserRow.js';

export default function Administration() {
    const userSession = useContext(UserContext); // the user's session data

    const [banUserId, setBanUserId] = useState("");
    const [appointModeratorId, setAppointModeratorId] = useState("");
    const [unappointModeratorId, setUnappointModeratorId] = useState("");
    const [returnData, setReturnData] = useState(null);

    /** Gets the approval requests from the back end. */
    function getApprovalRequests() {
        if (userSession?.role < 2) return; // don't fetch if the user is not an admin

        fetch('/api/users/approval-requests')
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /** Bans an unapproved or approved user. Only moderators and administrators can do this. */
    function banUser(e) {
        e.preventDefault();
        if (userSession.role < 2) return; // only moderators and admins can ban users

        fetch('/api/users/ban-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUserId: banUserId,
                moderatorUserId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /** Appoints a moderator by promoting an approved user. Only administrators can do this. */
    function appointModerator(e) {
        e.preventDefault();
        if (userSession.role !== 3) return; // only admins can do this

        fetch('/api/users/appoint-moderator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUserId: appointModeratorId,
                adminUserId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /** Unappoints a moderator by demoting them to an approved user. Only administrators can do this. */
    function unappointModerator(e) {
        e.preventDefault();
        if (userSession.role !== 3) return; // only admins can do this

        fetch('/api/users/unappoint-moderator', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUserId: unappointModeratorId,
                adminUserId: userSession.user_id
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /** Maps all of the unapproved users to a new UnapprovedUserRow component. */
    function displayUnapprovedUsers() {
        if (returnData?.unapprovedUsers?.length === 0) return <h3>No users need to be approved.</h3>;
        else return returnData?.unapprovedUsers?.map((user) => {
            return (
                <UnapprovedUserRow key={user.user_id} userId={user.user_id} fullName={user.full_name} email={user.email}
                    sfsuIdNumber={user.sfsu_id_number} sfsuIdPicture={user.sfsu_id_picture_path} joinDate={user.join_date}
                />
            );
        });
    }

    /** Fetch the approval requests whenever the approval requests tab is selected. */
    function handleTabSelect(key) {
        if (key === "approval-requests") getApprovalRequests();
    }

    /* Get the approval requests when the page has loaded. */
    useEffect(() => getApprovalRequests(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Alert the user if their action was successful or not. Clear all forms after receiving the back end's message. */
    useEffect(() => {
        if (returnData?.message) {
            alert(returnData.message);
            setBanUserId('');
            setAppointModeratorId('');
            setUnappointModeratorId('');
        }
    }, [returnData]);

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (userSession.role < 2) return <h1 className='page-title'>You must be a moderator or admin to see this page.</h1>;
    else return (
        <div className="admin-page">
            <h2 className='page-title'>Moderation {userSession.role === 3 && "and Administration"} Tools</h2>

            <Tabs className="admin-tabs mb-3" defaultActiveKey="approval-requests" onSelect={handleTabSelect}>
                {/* Approve/Disapprove users here. */}
                <Tab eventKey="approval-requests" title="Approval Requests">{displayUnapprovedUsers()}</Tab>

                {/* Ban, unappoint, or appoint users here. */}
                <Tab eventKey="user-management" title="User Management">
                    {/* Ban User Form */}
                    <Form className='ban-user-form' onSubmit={banUser}>
                        <Form.Group className='mb-3' controlId='ban-user'>
                            <p className='form-header mb-1'>Ban User</p>
                            <Form.Text>This bans Unapproved and Approved Users.</Form.Text>
                            <Form.Control className='text-bar mt-2 mb-1' required type='text' value={banUserId}
                                placeholder="Enter the user ID of the user you are banning."
                                onChange={e => setBanUserId(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='ban-button default-button-color mb-5' type='submit'>Ban</Button>
                    </Form>

                    {/* Appoint Moderator Form */}
                    {userSession.role === 3 && <Form className='appoint-mod-form' onSubmit={appointModerator}>
                        <Form.Group className='mb-3' controlId='appoint-mod'>
                            <p className='form-header mb-1'>Appoint Moderator</p>
                            <Form.Text>This promotes an Approved User to a Moderator.</Form.Text>
                            <Form.Control className='text-bar mt-2 mb-1' required type='text' value={appointModeratorId}
                                placeholder="Enter the Approved User's user ID."
                                onChange={e => setAppointModeratorId(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='appoint-button default-button-color mb-5' type='submit'>Appoint</Button>
                    </Form>}

                    {/* Unappoint Moderator Form */}
                    {userSession.role === 3 && <Form className='unappoint-mod-form' onSubmit={unappointModerator}>
                        <Form.Group className='mb-3' controlId='unappoint-mod'>
                            <p className='form-header mb-1'>Unappoint Moderator</p>
                            <Form.Text>This demotes a Moderator to an Approved User.</Form.Text>
                            <Form.Control className='text-bar mt-2 mb-1' required type='text' value={unappointModeratorId}
                                placeholder="Enter the Moderator's user ID."
                                onChange={e => setUnappointModeratorId(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='unappoint-button default-button-color' type='submit'>Unappoint</Button>
                    </Form>}
                </Tab>
            </Tabs>
        </div>
    );
}