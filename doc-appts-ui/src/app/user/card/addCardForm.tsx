'use client';

import { CardState, handleCardAdd } from "@/app/lib/actions";
import { FormEvent, startTransition, useActionState, useEffect, useState } from "react";
import styles from '@/app/user/card/userCard.module.css';

export default function AddCardForm(props: {saveCard: boolean, cardSubmitCallback: Function | null}) {
    const initialCardState: CardState = {message: null, errors: {}};
    const [error, formAction, isPending] = useActionState<CardState, FormData>(handleCardAdd, initialCardState);
    const [editCounter, setEditCounter] = useState(0);
    const [cardNumber, setCardNumber] = useState<string | null>(null);
    const [saveCardChecked, setSaveCardChecked] = useState(false);
    const [successMsg, setSuccessMsg] = useState(error.message?.startsWith("Card add success") ? "Paying with card with number " + cardNumber : "");
    console.log(successMsg);
    console.log(error.message);
    
    useEffect(() => {
        console.log("Add card use effect");
        if (error.message?.startsWith("Card add success") && props.cardSubmitCallback) {
        props.cardSubmitCallback({cardNumber: cardNumber, id: parseInt(error.message.split("---")[1])});
    }
    });
    /*if (successMsg.startsWith("Paying with card with number") && props.cardSubmitCallback) {
        props.cardSubmitCallback({cardNumber: cardNumber});
    }*/

    function formOnChange(e: FormEvent<HTMLFormElement>) {
        setEditCounter(1);
        startTransition(() => formAction(new FormData(e.currentTarget)));
    }

    function submitFormHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("cardAddButton");
        const fd = new FormData(e.currentTarget, el);
        if (props.saveCard && !saveCardChecked) {
            console.log("Not save card");
            setSuccessMsg("Paying with card with number " + fd.get('cardNumber')?.toString());
            if (props.cardSubmitCallback) {
                props.cardSubmitCallback({cardNumber: fd.get('cardNumber')?.valueOf().toString()});
            }
            return;
        }
        console.log("Save card");
        if (props.saveCard) {
            fd.append('do_not_redirect_add_card', 'doNotRedirect');
        }
        startTransition(() => formAction(fd));
        setCardNumber(fd.get('cardNumber')?.valueOf().toString() ?? '');
    }

    function toggleSaveCardChecked() {
        setSaveCardChecked(!saveCardChecked);
    }

    return (<>{successMsg === "" && error.message !== "Add card success" ?
        <form onChange={formOnChange} onSubmit={submitFormHandler}>
            <h4>Add card</h4>
            <label><b>Card number</b></label>&nbsp;
            <input type="number" name="cardNumber"></input><br></br>
            {error.errors?.cardNumber && error.errors?.cardNumber.map((err) => (
                <p key={err} className={styles.errorMessage}>{err}</p>
            ))}
            {props.saveCard ? <><label htmlFor="saveCard"><b>Save card?</b></label><input type="checkbox" id="saveCard" name="saveCard" onClick={() => toggleSaveCardChecked()}></input></>: null}<br></br>
            {(isPending || error.message !== null || editCounter == 0) ?
            <button disabled>Submit</button> :
            <button type="submit" name="cardAddButton" id="cardAddButton" value={"AddCard"}>Submit</button>}<br></br>
            {error.message === "Card add failed" ? <p className={styles.errorMessage}>Add card failed</p> : null}
        </form> : <p>{successMsg}</p>}</>
    )
}