'use client';

import { getPractitionerByEmailAndMobile, bookAppointmentServer, getPracticeByNameAndPhone, getCard, Card, bookAppointment, createBookingMfaEmail, createMfa, checkMfaCode } from "@/app/lib/actions";
import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import { formatStartTime } from "@/app/practice/practitionerCard";
import Payment from "./payment";
import { ChangeEvent, InputEvent, useEffect, useState } from "react";
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
    const [mfaSucceed, setMfaSucceed] = useState(false);
    const [mfaCodeInputVal, setMfaCodeInputVal] = useState("");
    const [mfaCodeInputErr, setMfaCodeInputErr] = useState("");
    const [mfaEmailLimitErr, setMfaEmailLimitErr] = useState(false);

    console.log("Before use effect");
    useEffect(() => {console.log("Inside use effect");
    async function fetchData() {
        console.log("Inside fetch data");
    const params = await props.params;
    console.log("Params below");
    console.log(params);
    const res = params.practitionerId.split("---");
    const tmpPractitioner = await getPractitionerByEmailAndMobile(res[0], res[1]);
    setPractitioner(tmpPractitioner);
    const lastIndex = res[0].lastIndexOf("%40");
    if (lastIndex !== -1) {
        res[0] = res[0].substring(0, lastIndex) + "@" + res[0].substring(lastIndex+3, res[0].length);
    }
    const practiceId = params.id.split("---");
    setPracticeId0(practiceId[0].replace("%20", " "));
    setPracticeId1(practiceId[1]);
    const tmpPractice = await getPracticeByNameAndPhone(practiceId[0], practiceId[1])
    setPractice(tmpPractice);
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
    setFormattedDate(formattedDateTmp);
    if (tmpPractice.billing === "No bulk billing" || (tmpPractice.billing == "Mixed" && tmpPractitioner.billing)) {
        const res = await createMfa();
        if (res === "Too many codes requested in short period of time") {
            setMfaEmailLimitErr(true);
        }
    }};
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

    async function resendMfaCode() {
        const res = await createMfa();
        if (res === "Too many codes requested in short period of time") {
            setMfaEmailLimitErr(true);
        }
        setMfaCodeInputErr("Sent a new code to your email");
    }

    async function checkCode() {
        console.log("Check code");
        const result = await checkMfaCode(mfaCodeInputVal);
        if (result === "Code matches") {
            setMfaSucceed(true);
            setMfaCodeInputErr("");
        } else {
            setMfaCodeInputErr(result);
        }
        setMfaCodeInputVal("");
    }

    function mfaCodeInputValChange(ev: ChangeEvent<HTMLInputElement>) {
        setMfaCodeInputVal(ev.target.value);
        setMfaCodeInputErr("");
    }

    return (
        <div className={styles.practitionerInfo}>
            <h3>Book appointment</h3><br></br>
            <p>{practiceId0}</p>
            <p>{practitioner.firstName + " " + practitioner.lastName}</p>
            <p>{formattedDate}</p>
            <p>{formattedAppointmentTime}</p><br></br>
            {!mfaEmailLimitErr ? <div>
            {(practice.billing === "No bulk billing" || (practice.billing == "Mixed" && practitioner.billing)) && !mfaSucceed ?
            <div>
                <p>Enter multifactor authentication code sent to your email to proceed:</p>
                <input type="string" id="mfaInput" value={mfaCodeInputVal} onChange={(evt) => mfaCodeInputValChange(evt)}></input><br></br>
                <button type="submit" onClick={() => checkCode()}>Submit</button>&nbsp;
                <button onClick={resendMfaCode}>Resend code?</button>
                {mfaCodeInputErr !== "" ? <p className={styles.errMessage}>{mfaCodeInputErr}</p> : null}
            </div> : null}
            {(practice.billing === "No bulk billing" || (practice.billing == "Mixed" && practitioner.billing)) && mfaSucceed ?
            <><Payment billingRate={practice.billingRate!} card={card} bookingCallbackFn={cardTransferFromPayments}></Payment><br></br>
            {card.cardNumber && !bookAppointmentPending ? <button onClick={() => bookAppt()}>Book appointment</button> : <button disabled>Book appointment</button>}</> :
            (practice.billing === "Bulk billed" || (practice.billing == "Mixed" && !practitioner.billing)) ? <button onClick={() => bookAppt()}>Book appointment</button> : null}
            </div> : <p>Too many MFA codes requested in a short period of time. Try again later.</p>}
        </div>
    )
}

export function formatDate(date: string): string {
    const tmp = date.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"];
    return tmp[2]+" "+months[parseInt(tmp[1])]+" "+tmp[0];
}