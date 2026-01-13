'use client';

import { getPractitionerByEmailAndMobile, bookAppointmentServer, getPracticeByNameAndPhone, getCard, Card, bookAppointment } from "@/app/lib/actions";
import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import { formatStartTime } from "@/app/practice/practitionerCard";
import Payment from "./payment";
import { useEffect, useState } from "react";
import { Practice, Practitioner } from "@/app/search/search";

type ApptUrl = {
    id: string,
    practitionerId: string,
    appointmentId: string
}

export default function Page(props: {params: Promise<ApptUrl>}) {
    const [practitioner, setPractitioner] = useState<Practitioner>({});
    const [practiceId0, setPracticeId0] = useState("");
    const [practiceId1, setPracticeId1] = useState("");
    const [practice, setPractice] = useState<Practice>({});
    const [card, setCard] = useState<Card>({});
    const [appointment, setAppointment] = useState<string[]>([]);
    const [formattedAppointmentTime, setFormattedAppointmentTime] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [finalDateForServer, setFinalDateForServer] = useState("");
    const [finalTimeForServer, setFinalTimeForServer] = useState("");
    const [bookAppointmentPending, setBookAppointmentPending] = useState(false);

    console.log("Before use effect");
    useEffect(() => {console.log("Inside use effect");
        
    async function fetchData() {
        console.log("Inside fetch data");
    const params = await props.params;
    console.log("Params below");
    console.log(params);
    const res = params.practitionerId.split("---");
    setPractitioner(await getPractitionerByEmailAndMobile(res[0], res[1]));
    const lastIndex = res[0].lastIndexOf("%40");
    if (lastIndex !== -1) {
        res[0] = res[0].substring(0, lastIndex) + "@" + res[0].substring(lastIndex+3, res[0].length);
    }
    const practiceId = params.id.split("---");
    setPracticeId0(practiceId[0].replace("%20", " "));
    setPracticeId1(practiceId[1]);
    setPractice(await getPracticeByNameAndPhone(practiceId[0], practiceId[1]));
    const match = document.cookie.match("(^|;)\\s*" + "userId" + "\\s*=\\s*([^;]+)");
    const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
    setCard(await getCard(match?.pop() ?? '', sessionId?.pop() ?? ''));
    const appt = params.appointmentId.split("---");
    console.log(appt);
    appt[1] = appt[1].replace("%3A", ":");
    const formattedAppointmentTimeTmp = formatStartTime(appt[1]);
    const formattedDateTmp: string = formatDate(appt[0]);
    const initialDateForServer = appt[0].split("-");
    initialDateForServer[1] = (parseInt(initialDateForServer[1])+1).toString();
    if (initialDateForServer[1].length < 2) {
        initialDateForServer[1] = "0" + initialDateForServer[1];
    }
    if (initialDateForServer[2].length < 2) {
        initialDateForServer[2] = "0" + initialDateForServer[2];
    }
    const finalDateForServerTmp = initialDateForServer[0]+"-"+initialDateForServer[1]+"-"+initialDateForServer[2];
    const finalTimeForServerTmp = appt[1]+":00";
    setAppointment(appt);
    setFinalDateForServer(finalDateForServerTmp);
    setFinalTimeForServer(finalTimeForServerTmp);
    setFormattedAppointmentTime(formattedAppointmentTimeTmp);
    setFormattedDate(formattedDateTmp);};
    fetchData();}, []);

    function cardTransferFromPayments(cardRecentlyCreated: Card) {
        console.log("Page callback");
        setCard(cardRecentlyCreated);
    }

    async function bookAppt() {
        setBookAppointmentPending(true);
        await bookAppointment(practitioner, card, practiceId0, practiceId1, finalDateForServer, finalTimeForServer)
        .then((val) => {setBookAppointmentPending(false)});
    }

    return (
        <div className={styles.practitionerInfo}>
            <h3>Book appointment</h3><br></br>
            <p>{practiceId0}</p>
            <p>{practitioner.firstName + " " + practitioner.lastName}</p>
            <p>{formattedDate}</p>
            <p>{formattedAppointmentTime}</p><br></br>
            {practice.billing === "No bulk billing" || (practice.billing == "Mixed" && practitioner.billing) ?
            <><Payment billingRate={practice.billingRate!} card={card} bookingCallbackFn={cardTransferFromPayments}></Payment><br></br>
            {card.cardNumber && !bookAppointmentPending ? <button onClick={() => bookAppt()}>Book appointment</button> : <button disabled>Book appointment</button>}</> :
            <button onClick={() => bookAppt()}>Book appointment</button>}
        </div>
    )
}

export function formatDate(date: string): string {
    const tmp = date.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"];
    return tmp[2]+" "+months[parseInt(tmp[1])]+" "+tmp[0];
}