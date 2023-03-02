/* This file holds the code for the How to Join a Group help page, which explains how one can join a group. */

import { joinGroup } from '../../components/help/Questions';

export default function JoinGroup() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{joinGroup.question}</h1>
            <p className="answer">
                To join a group, you must be invited to it by one of the group's members. After you have been invited to a group,
                check your inbox and you will see an invite link sent by the person inviting you.
                Copy that link and paste it your browser's address bar, and you will join the group. <br /><br />

                Invite links look like this: <br />
                http://54.241.101.69/join-group/0/ad1ad31-da6ns5a-zc123-04a
            </p>
         </div>
    );
}