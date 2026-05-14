import styles from '@/app/practice/practice.module.css';
import { Practitioner } from "../search/search";

interface cardProps {
    practitioner: Practitioner
}

export default function PractitionerCard(practitioner: cardProps) {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const apptDate : Date | null = practitioner.practitioner.appointments ?
    (practitioner.practitioner.appointments.availableAppointmentsDTO ? new Date(Date.parse(practitioner.practitioner.appointments.availableAppointmentsDTO[0].date?.toString() || '')) : null)
    : null;
    const apptStartTime : string | null = practitioner.practitioner.appointments ?
    (practitioner.practitioner.appointments.availableAppointmentsDTO ? practitioner.practitioner.appointments.availableAppointmentsDTO[0].startTime?.toString().slice(0,5) || null : null)
    : null;
    let apptDateString = null;
    let apptStartTimeString = null;
    if (apptDate) {
        apptDateString = apptDate.getDate() + ' ' + month[apptDate.getMonth()];
    };

    apptStartTimeString = formatStartTime(apptStartTime);

    return (
        <div className={styles.card}>
            <p>{practitioner.practitioner.firstName} {practitioner.practitioner.lastName}</p>
            <p>{practitioner.practitioner.specialty}</p>
            {apptDateString && apptStartTime ?
            <p>Next available appointment: {apptDateString + ' ' + apptStartTimeString}</p> :
            <p>No available appointments</p>}
        </div>
    )
}

export function formatStartTime(startTime: string | null): string {
    if (startTime) {
    const dayAndTime = startTime.split(":");
    let dayInt = parseInt(dayAndTime[0]);
    if (dayInt == 0) {
        return "12:" + dayAndTime[1] + " AM";
    } else if (dayInt > 0 && dayInt < 12) {
        return dayInt + ":" + dayAndTime[1] + " AM";
    } else if (dayInt == 12) {
        return "12:" + dayAndTime[1] + " PM";
    } else {
        dayInt = dayInt - 12;
        return dayInt + ":" + dayAndTime[1] + " PM";
    }};
    return '';
}