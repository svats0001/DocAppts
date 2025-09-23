import { getAllAppointmentsForUser, UserAppointment } from "@/app/lib/actions";
import { cookies } from "next/headers";
import styles from '@/app/user/appointments/userAppointments.module.css';
import { formatStartTime } from "@/app/practice/practitionerCard";
import { formatDate } from "@/app/practice/[id]/practitioner/[practitionerId]/appointment/[appointmentId]/alert";
import { redirect } from "next/navigation";
import CancelButton from "./cancelButton";

export default async function Page() {
    const cookieStore = await cookies();
    let appointments: UserAppointment[] = [];
    const userId = cookieStore.get("userId")?.value;
    if (userId) {
        appointments = await getAllAppointmentsForUser(userId);
        console.log(appointments);
    }

    async function cancelAppointment(appt: UserAppointment) {
        "use server";
        const cookieStore2 = await cookies();
        cookieStore2.set("bookedAppointmentId", appt.bookedAppointmentId.toString());
        cookieStore2.set("appointmentId", appt.appointmentId.toString());
        redirect("/user/appointments/cancel/"+appt.practiceName+"---"+appt.practitionerName+"---"+appt.date+"---"+appt.startTime);
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
                    <CancelButton cancelFn={cancelAppointment} val={val}></CancelButton>
                </div>    
            )) : <p>No appointments</p>}
        </div>
    )
}