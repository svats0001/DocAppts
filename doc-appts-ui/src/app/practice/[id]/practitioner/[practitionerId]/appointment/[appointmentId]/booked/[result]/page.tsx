import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";

export default async function Page(props: {params: Promise<{result: string}>}) {
    const params = await props.params;
    const result = params.result;

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
    )} else {
        return (
        <div className={styles.practitionerInfo}>
            <h3>Error in booking appointment</h3>
        </div>
    )}
}