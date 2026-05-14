import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import Link from "next/link";

export default async function Page(props: {params: Promise<{result: string, id: string, practitionerId: string}>}) {
    const params = await props.params;
    const result = params.result;
    const practiceId = params.id;
    const practitionerId = params.practitionerId;
    const urlString = "/practice/" + practiceId + "/practitioner/" + practitionerId;

    if (result === "success") {
        return (
        <div className={styles.practitionerInfo}>
            <h3>Appointment booked</h3>
        </div>
    )} else if (result === "userError") {
        return (
        <div className={styles.practitionerInfo}>
            <h3>You must be logged in to book appointment. Session expired.</h3>
        </div>
    )} else if (result === "bookingError") {
        return (
        <div className={styles.practitionerInfo}>
            <h3>Appointment has already been booked</h3>
            <Link href={urlString}>Click to go back to list of appointments</Link>
        </div>
    )} else {
        return (
        <div className={styles.practitionerInfo}>
            <h3>Server error. Try again later.</h3>
            <Link href={urlString}>Click to go back to list of appointments</Link>
        </div>
    )}
}