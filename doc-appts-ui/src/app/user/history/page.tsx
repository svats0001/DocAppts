import { AppointmentHistory, BookedAppointmentPracticePractitioner, getBookedAppointmentsByUserIdAndDate } from '@/app/lib/actions';
import { BookedAppointment } from '@/app/search/search';
import styles from '@/app/user/history/history.module.css';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Page() {
    let appointmentHistory: AppointmentHistory = {};
    try {
        appointmentHistory = await getBookedAppointmentsByUserIdAndDate();
    } catch (exc) {

    }

    function practiceClickHandler() {
        redirect("/practice/"+appointmentHistory.mostVisitedPractice!.name + "?practice=" + appointmentHistory.mostVisitedPractice?.publicId);
    }

    function practitionerClickHandler() {
        redirect("/practice/" + appointmentHistory.mostVisitedPractice?.name + "/practitioner/" + appointmentHistory.mostVisitedPractitioner?.firstName + " " + appointmentHistory.mostVisitedPractitioner?.lastName + "?practice=" + appointmentHistory.mostVisitedPractice?.publicId + "&practitioner=" + appointmentHistory.mostVisitedPractitioner?.publicId);
    }

    return (
        <div className={styles.historyEncapsulator}>
            <h3>Appointment history</h3><br></br>
            <div className={styles.historyContainer}>
            {appointmentHistory.appointments && appointmentHistory.appointments.length > 0 ? appointmentHistory.appointments.map((appt) => (
                <div key={appt.id} className={styles.card}>
                    <p>{appt.practiceName}</p>
                    <p>{appt.practitionerName}</p>
                    <p>{appt.date?.toString()}</p>
                    <p>{appt.startTime?.toString()}</p>
                </div>
            )) : <></>}
            </div>
            <h3>Quick links</h3><br></br>
            {appointmentHistory.mostVisitedPractice ? <Link className={styles.quicklinks} href={"/practice/"+appointmentHistory.mostVisitedPractice!.name + "?practice=" + appointmentHistory.mostVisitedPractice?.publicId}>
                <p>{appointmentHistory.mostVisitedPractice.name}</p>
            </Link> : <></>}
            {appointmentHistory.mostVisitedPractice && appointmentHistory.mostVisitedPractitioner ? <Link className={styles.quicklinks} href={"/practice/" + appointmentHistory.mostVisitedPractice?.name + "/practitioner/" + appointmentHistory.mostVisitedPractitioner?.firstName + " " + appointmentHistory.mostVisitedPractitioner?.lastName + "?practice=" + appointmentHistory.mostVisitedPractice?.publicId + "&practitioner=" + appointmentHistory.mostVisitedPractitioner?.publicId}>
                <p>{appointmentHistory.mostVisitedPractitioner.firstName + " " + appointmentHistory.mostVisitedPractitioner.lastName}</p>
            </Link> : <></>}
        </div>
    )
}