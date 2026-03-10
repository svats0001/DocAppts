'use client';

import { BookedAppointmentPractice, getBookedAppointmentPractice } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import { BookedAppointmentCard } from "./bookedAppointmentCard";
import styles from '@/app/practice/practice.module.css';

export default function Page() {
    const [appointments, setAppointments] = useState<BookedAppointmentPractice[]>([]);
    const curDate: Date = new Date();
    curDate.setHours(0, 0, 0, 0);
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Today");

    useEffect(() => {
        const practiceId = document.cookie.match("(^|;)\\s*" + "practiceId" + "\\s*=\\s*([^;]+)");
        const practiceSessionId = document.cookie.match("(^|;)\\s*" + "practiceSessionId" + "\\s*=\\s*([^;]+)");
        const fetchAppointments = async() => {
            const appts = await getBookedAppointmentPractice(practiceId?.pop() ?? '', practiceSessionId?.pop() ?? '');
            for (let i = 0; i < appts.length; i++) {
                appts[i].date = new Date(appts[i].date!);
                appts[i].date?.setHours(0, 0, 0, 0);
            }
            setAppointments(appts);
            console.log(appts);
            if (appts.length > 0) {
                console.log(typeof appts[0].date);
                console.log(appts[0].date);
            }
        }
        fetchAppointments().then(() => console.log(appointments));
    }, []);

    function toggleTimeframe(timeframe: string) {
        setSelectedTimeframe(timeframe);
    }

    return (
        <div className={styles.practiceInfo}>
            <h2>Booked Appointments</h2><br></br>
            <div>
            <h3 onClick={() => toggleTimeframe("Today")} className={styles.timeframeHeader}>Today</h3><br></br><br></br>
            {selectedTimeframe === "Today" ?
            <div className={styles.cardBox}>
            {appointments.map((appt) => (
                appt.date!.getTime() === curDate.getTime() ? <BookedAppointmentCard info={appt} key={appt.id}></BookedAppointmentCard> : null
            ))}
            </div> : null}
            </div>
            <div>
            <h3 onClick={() => toggleTimeframe("This week")} className={styles.timeframeHeader}>This week</h3><br></br><br></br>
            {selectedTimeframe === "This week" ?
            <div className={styles.cardBox}>
            {appointments.map((appt) => (
                appt.date!.getTime() >= (curDate.getTime() + 86400000) && appt.date!.getTime() <= (curDate.getTime() + 7*86400000) ? 
                <BookedAppointmentCard info={appt} key={appt.id}></BookedAppointmentCard> : null
            ))}
            </div> : null}
            </div>
            <div>
            <h3 onClick={() => toggleTimeframe("Next 30 days")} className={styles.timeframeHeader}>Next 30 days</h3><br></br><br></br>
            {selectedTimeframe === "Next 30 days" ?
            <div className={styles.cardBox}>
            {appointments.map((appt) => (
                appt.date!.getTime() >= (curDate.getTime() + 7*86400000) && appt.date!.getTime() <= (curDate.getTime() + 30*86400000) ? 
                <BookedAppointmentCard info={appt} key={appt.id}></BookedAppointmentCard> : null
            ))}
            </div> : null}
            </div>
            <div>
            <h3 onClick={() => toggleTimeframe("Future")} className={styles.timeframeHeader}>Future</h3><br></br><br></br>
            {selectedTimeframe === "Future" ?
            <div className={styles.cardBox}>
            {appointments.map((appt) => (
                appt.date!.getTime() >= (curDate.getTime() + 30*86400000) && appt.date!.getTime() <= (curDate.getTime() + 180*86400000) ? 
                <BookedAppointmentCard info={appt} key={appt.id}></BookedAppointmentCard> : null
            ))}
            </div> : null}
            </div>
        </div>
    )
}

function dateComparison(date1: Date, date2: Date) {
    if (date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() ===
date2.getFullYear()) {
        return 1;
    }
}