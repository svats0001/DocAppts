'use client';

import { Card } from "@/app/lib/actions";
import AddCardForm from "@/app/user/card/addCardForm";

export default function Payment(props: {billingRate: number, card: Card, bookingCallbackFn: Function}) {
    function addCardCallback(card: Card) {
        console.log("Payment callback");
        props.bookingCallbackFn(card);
    };

    return (
        <div>
            {props.card.cardNumber ? <p>Paying with card ending in {props.card.cardNumber.toString().substring(props.card.cardNumber.toString().length-4, props.card.cardNumber.toString().length)}.</p> :
            <><AddCardForm saveCard={true} cardSubmitCallback={addCardCallback}></AddCardForm><br></br></>}
            <p>Paying amount ${props.billingRate}</p>
        </div>
    )
}