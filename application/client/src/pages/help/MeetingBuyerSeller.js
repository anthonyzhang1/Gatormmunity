/* This file holds the code for the Meeting a Buyer or Seller help page, which explains what one should do before and after
 * meeting a buyer or seller. */

import { meetingBuyerSeller } from '../../components/help/Questions';

export default function MeetingBuyerSeller() {
    return (
        <div className="help-answer-page">
            <h1 className="page-title">{meetingBuyerSeller.question}</h1>
            <p className="answer">
                We recommend meeting at a public location such as a restaurant or, preferably, on campus. We do not
                recommend meeting in a private location such as one's home. <br /><br />

                Before you meet your buyer/seller, you should know what they are wearing or what they look like so that
                you do not interact with the wrong person. We also recommend telling a friend or family member
                where you are going before you meet the buyer/seller. Finally, before you finish the transaction,
                you should check your item to ensure that it is what you expected and it
                is the item you are paying for. <br /><br />

                Be careful of scammers! If you feel that you were scammed or taken advantage of, please
                contact us and we will investigate the matter.
            </p>
         </div>
    );
}