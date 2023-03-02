import { groupPurpose } from '../../components/help/Questions';

export default function GroupPurpose() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{groupPurpose.question}</h1>
            <p className="answer">
                Groups exist for users to communicate with others as a group, rather than having to communicate to a group
                of people one-by-one. Instead of communicating in the global Gatormmunity Forum or Gator Chat where everyone
                can see everybody's messages, a group's members can talk in their group's forum or chat, where only members
                of the group can see and respond to the messages.
            </p>
        </div>
    );
}