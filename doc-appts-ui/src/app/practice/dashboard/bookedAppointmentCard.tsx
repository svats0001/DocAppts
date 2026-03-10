import { BookedAppointmentPractice } from "@/app/lib/actions";
import styles from '@/app/practice/practice.module.css';

export function BookedAppointmentCard(props: {info: BookedAppointmentPractice}) {
    return (
        <div className={styles.card}>
            <p><b>Date </b>{props.info.date?.toDateString()}</p>
            <p><b>Time </b>{props.info.startTime?.toString() + " to " + props.info.endTime?.toString()}</p>
            <p><b>Practitioner </b>{props.info.practitionerName}</p>
            <p><b>Patient </b>{props.info.userName}</p>
        </div>
    )
}