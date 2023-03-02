/* This file holds the code for the Administration page, which is only accessible to mods and admins.
 * On the Administration page, mods and admins can approve or reject unapproved users.
 * Approving them means the unapproved user will become an approved user, whereas rejecting them deletes the unapproved user.
 * Mods may ban unapproved and approved users on this page, and admins can do that as well as appoint and unappoint mods. */

import { useContext, useEffect, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App.js';
import UnapprovedUserRow from '../components/administration/UnapprovedUserRow.js';
import { ADMINISTRATOR_ROLE, MODERATOR_ROLE } from '../components/Constants.js';

export default function Administration() {
    const userSession = useContext(UserContext); // the user's session data

    const [returnData, setReturnData] = useState(null); // the data returned from the back end
    const [banUserId, setBanUserId] = useState(""); // the user's input in the ban user field
    const [appointModeratorId, setAppointModeratorId] = useState(""); // the user's input in the appoint mod field
    const [unappointModeratorId, setUnappointModeratorId] = useState(""); // the user's input in the unappoint mod field
    const [changePasswordTargetId, setChangePasswordTargetId] = useState(""); // the user ID for the change password form
    const [newPlaintextPassword, setNewPlaintextPassword] = useState(""); // the new password for the change password form

    /** Gets the approval requests from the back end. */
    function getApprovalRequests() {
        if (userSession?.role < MODERATOR_ROLE) return; // don't fetch if the user is not a mod

        fetch('/api/users/approval-requests')
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /**
     * Asks the back end to ban an unapproved or approved user.
     * 
     * Fetch Request's Body:
     * targetUserId: {string} The id of the user being banned.
     * moderatorUserId: {string} The id of the moderator doing the banning.
     */
    function banUser(e) {
        e.preventDefault();
        if (userSession.role < MODERATOR_ROLE) return; // only moderators and admins can ban users

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

    /**
     * Appoints a moderator by promoting an approved user.
     * 
     * Fetch Request's Body:
     * targetUserId: {string} The id of the user being promoted.
     * adminUserId: {string} The id of the admin doing the promoting.
     */
    function appointModerator(e) {
        e.preventDefault();
        if (userSession.role !== ADMINISTRATOR_ROLE) return; // only admins can do this

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

    /**
     * Unappoints a moderator by demoting them to an approved user.
     * 
     * Fetch Request's Body:
     * targetUserId: {string} The id of the user being demoted.
     * adminUserId: {string} The id of the admin doing the demoting.
     */
    function unappointModerator(e) {
        e.preventDefault();
        if (userSession.role !== ADMINISTRATOR_ROLE) return; // only admins can do this

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

    /**
     * Changes a user's password, as long as the target user is not an administrator.
     * 
     * Fetch Request's Body:
     * targetUserId: {string} The id of the user whose password is being changed.
     * adminUserId: {string} The id of the admin changing the password.
     * newPlaintextPassword: {string} The new plaintext password to change to. Must be from 1-64 characters long.
     */
    function changePassword(e) {
        e.preventDefault();
        if (userSession.role !== ADMINISTRATOR_ROLE) return; // only admins can do this

        fetch('/api/users/admin-change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                targetUserId: changePasswordTargetId,
                adminUserId: userSession.user_id,
                newPlaintextPassword: newPlaintextPassword
            })
        })
            .then(res => res.json())
            .then(data => setReturnData(data))
            .catch(console.log());
    }

    /** Maps all of the unapproved users to component rows. */
    function displayUnapprovedUsers() {
        // if there are no unapproved users, show a message stating as such
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

    /** Clears all the forms on this page. */
    function clearAllForms() {
        setBanUserId('');
        setAppointModeratorId('');
        setUnappointModeratorId('');
        setChangePasswordTargetId('');
        setNewPlaintextPassword('');
    }

    /* Get the approval requests when the page loads. */
    useEffect(() => getApprovalRequests(), [userSession]); // eslint-disable-line react-hooks/exhaustive-deps

    /* Alert the user if their action was successful or not. Clear all forms after receiving the back end's message. */
    useEffect(() => {
        if (returnData?.message) {
            alert(returnData.message);
            clearAllForms();
        }
    }, [returnData]);

    if (!userSession) return; // wait for fetch
    else if (!userSession.isLoggedIn) return <Navigate to='/login' />; // login required
    else if (userSession.role < MODERATOR_ROLE) {
        return <h1 className='page-title'>You must be a moderator or admin to see this page.</h1>;
    } else return (
        <div className="admin-page">
            {/* The title will show "Administration" if the user is an admin. */}
            <h2 className='page-title'>Moderation {userSession.role === ADMINISTRATOR_ROLE && "and Administration"} Tools</h2>

            <Tabs className="admin-tabs mb-3" defaultActiveKey="approval-requests" onSelect={handleTabSelect}>
                {/* Approve/Reject users here. */}
                <Tab eventKey="approval-requests" title="Approval Requests">{displayUnapprovedUsers()}</Tab>

                {/* Ban, appoint, unappoint, or change password of users here. */}
                <Tab eventKey="user-management" title="User Management">
                    {/* Ban User Form */}
                    <Form className='ban-user-form' onSubmit={banUser}>
                        <Form.Group className='mb-3' controlId='ban-user'>
                            <p className='form-header mb-1'>Ban User</p>
                            <Form.Text>This bans Unapproved and Approved Users.</Form.Text>
                            <Form.Control className='text-bar mt-2 mb-1' required type='number' value={banUserId}
                                placeholder="Enter the user ID of the user to ban, e.g. 8"
                                onChange={e => setBanUserId(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='ban-button default-button-color mb-5' type='submit'>Ban</Button>
                    </Form>

                    {/* Appoint Moderator Form */}
                    {userSession.role === ADMINISTRATOR_ROLE && <Form className='appoint-mod-form' onSubmit={appointModerator}>
                        <Form.Group className='mb-3' controlId='appoint-mod'>
                            <p className='form-header mb-1'>Appoint Moderator</p>
                            <Form.Text>This promotes an Approved User to a Moderator.</Form.Text>
                            <Form.Control className='text-bar mt-2 mb-1' required type='number' value={appointModeratorId}
                                placeholder="Enter the Approved User's user ID, e.g. 5"
                                onChange={e => setAppointModeratorId(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='appoint-button default-button-color mb-5' type='submit'>Appoint</Button>
                    </Form>}

                    {/* Unappoint Moderator Form */}
                    {userSession.role === ADMINISTRATOR_ROLE &&
                        <Form className='unappoint-mod-form' onSubmit={unappointModerator}>
                            <Form.Group className='mb-3' controlId='unappoint-mod'>
                                <p className='form-header mb-1'>Unappoint Moderator</p>
                                <Form.Text>This demotes a Moderator to an Approved User.</Form.Text>
                                <Form.Control className='text-bar mt-2 mb-1' required type='number' value={unappointModeratorId}
                                    placeholder="Enter the Moderator's user ID, e.g. 9"
                                    onChange={e => setUnappointModeratorId(e.target.value)}
                                />
                            </Form.Group>

                            <Button className='unappoint-button default-button-color mb-5' type='submit'>Unappoint</Button>
                        </Form>
                    }

                    {/* Change User's Password Form */}
                    {userSession.role === ADMINISTRATOR_ROLE && <Form className='change-password-form' onSubmit={changePassword}>
                        <p className='form-header mb-1'>Change User's Password</p>
                        <Form.Text>This changes a user's password. This does not work on administrators.</Form.Text>

                        {/* Target User's ID Field */}
                        <Form.Group className='mt-3 mb-3' controlId='change-password-id'>
                            <Form.Control className='text-bar' required type='number'
                                value={changePasswordTargetId} placeholder="Enter the user's user ID, e.g. 2"
                                onChange={e => setChangePasswordTargetId(e.target.value)}
                            />
                        </Form.Group>

                        {/* New Plaintext Password Field */}
                        <Form.Group className='mb-3' controlId='change-password-new-password'>
                            <Form.Control className='text-bar' required type='text'
                                value={newPlaintextPassword} placeholder="Enter the user's new password."
                                onChange={e => setNewPlaintextPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button className='change-password-button default-button-color' type='submit'>Change</Button>
                    </Form>}
                </Tab>
            </Tabs>
        </div>
    );
}