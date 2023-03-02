/* This file holds the code for the Group Member Management help page, which explains how one can manage their group's members
 * as a group mod or group admin. */

import { groupMemberManagement } from '../../components/help/Questions';

export default function GroupMemberManagement() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{groupMemberManagement.question}</h1>
            <p className="answer">
                If you are a moderator or administrator in your group, you can manage your group's current members by clicking on
                the members icon on your group's home page. You will see a list of all the members in the group, and depending
                on your role within the group, you will be able to perform actions on the members of the group. <br /><br />

                <strong>Moderators of a group can:</strong><br />
                • Kick members from the group. <br />
                • Delete threads in the group's forum. <br />
                • Delete posts in the group's forum. <br /><br />

                <strong>Administrators of a group can: </strong><br />
                • Do anything moderators of a group can. <br />
                • Kick moderators from the group (after unappointing them). <br />
                • Appoint group moderators. <br />
                • Unappoint group moderators. <br />
                • Delete their group. <br />
            </p>
        </div>
    );
}