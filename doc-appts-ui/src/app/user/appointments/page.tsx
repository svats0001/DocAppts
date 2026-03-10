'use client';

import { getAllAppointmentsForUser, UserAppointment } from "@/app/lib/actions";
import styles from '@/app/user/appointments/userAppointments.module.css';
import { formatStartTime } from "@/app/practice/practitionerCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Page() {
    const [appointments, setAppointments] = useState<UserAppointment[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        async function getAppointments() {
        const userId = document.cookie.match("(^|;)\\s*" + "userId" + "\\s*=\\s*([^;]+)")?.pop();
        console.log(userId);
        if (userId) {
          setAppointments(await getAllAppointmentsForUser(userId.toString()));
        }};

        getAppointments();
    }, []);

    async function cancelAppointment(appt: UserAppointment) {
        Cookies.set("bookedAppointmentId", appt.bookedAppointmentId.toString());
        Cookies.set("appointmentId", appt.appointmentId.toString());
        router.push("/user/appointments/cancel/"+appt.practiceName+"---"+appt.practitionerName+"---"+appt.date+"---"+appt.startTime);
    }

    return (
        <div className={styles.appointmentInfo}>
            <h3>Your appointments</h3><br></br>
            {appointments.length > 0 ? appointments.map((val) => (
                <div className={styles.card} key={val.bookedAppointmentId}>
                    <p>{val.practiceName}</p>
                    <p>{val.practitionerName}</p>
                    <p>{formatDate(val.date.toString())}</p>
                    <p>{formatStartTime(val.startTime.toString())}</p>
                    <button type="submit" onClick={() => cancelAppointment(val)}>Cancel appointment</button>
                </div>    
            )) : <p>No appointments</p>}
        </div>
    )
}

export function formatDate(date: string): string {
    const tmp = date.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"];
    return tmp[2]+" "+months[parseInt(tmp[1])]+" "+tmp[0];
}