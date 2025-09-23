import styles from "@/app/user/appointments/userAppointments.module.css";
import Link from "next/link";

export default async function Page(props: {params: Promise<{result: string}>}) {
    const params = await props.params;
    const result = params.result;

    if (result === "success") {
        return (
            <div className={styles.appointmentInfo}>
                <h3>Successfully cancelled appointment</h3><br></br>
                <Link href="/user/appointments" className={styles.appointmentLink}>Go back to appointments</Link>
            </div>
        )
    } else {
        return (
            <div className={styles.appointmentInfo}>
                <h3>Error in cancelling appointment</h3><br></br>
                <Link href="/user/appointments" className={styles.appointmentLink}>Go back to appointments</Link>
            </div>
        )
    }
}