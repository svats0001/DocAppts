'use client';

import { Card, deleteCard, getCard } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import styles from '@/app/user/card/userCard.module.css';
import AddCardForm from "./addCardForm";

export default function Page() {
    const [card, setCard] = useState<Card>({});
    const [wantDelete, setWantDelete] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState("");
    const [addCard, setAddCard] = useState(false);
    let sessionId: any = '';

    useEffect(() => {const fetchCardForUser = async() => {
        const match = document.cookie.match("(^|;)\\s*" + "userId" + "\\s*=\\s*([^;]+)");
        sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        console.log(sessionId);
        const data = await getCard(match?.pop() ?? '', sessionId?.pop() ?? '');
        console.log(data);
        setCard(data);
    }; fetchCardForUser();
    }, []);

    function flipWantDelete() {
        setWantDelete(!wantDelete);
    }

    async function deleteCardForUser() {
        sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        try {
        const data = await deleteCard(card.id, sessionId?.pop() ?? '');
        if (data === "Successfully deleted card") {
            setCard({});
        } else {
            setDeleteMessage("Delete card failed");
        }} catch (exc) {
            setDeleteMessage("Delete card failed");
        }
    }

    function toggleAddCard() {
        setAddCard(!addCard);
    }

    return (
        <div className={styles.cardInfo}>
            <h3>Card</h3><br></br><br></br>
            {card.cardNumber ? 
            <div className={styles.card}>
                <p><b>Card number </b>{card.cardNumber}</p>
                <p><b>Token </b>{card.token}</p>
                {!wantDelete ? <><button onClick={() => flipWantDelete()}>Delete</button><br></br></> :
                <div><p>Are you sure you want to delete this card?</p>
                <button onClick={() => deleteCardForUser()}>Yes</button>&nbsp;
                <button onClick={() => flipWantDelete()}>No</button><br></br>
                <p className={styles.errorMessage}>{deleteMessage}</p></div>}
            </div> : <div>
                <button onClick={() => toggleAddCard()}>Add card</button><br></br>
                {addCard ? <AddCardForm saveCard={false} cardSubmitCallback={null}></AddCardForm> : null}
                </div>}
        </div>
    )
}