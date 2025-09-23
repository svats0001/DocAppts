import { formatDate } from "@/app/practice/[id]/practitioner/[practitionerId]/appointment/[appointmentId]/alert";
import { formatStartTime } from "@/app/practice/practitionerCard";
import styles from "@/app/user/appointments/userAppointments.module.css";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { cancelAppointment } from "@/app/lib/actions";
import CancelOptionButton from "./cancelOptionButton";

export default async function Page(props: {params: Promise<{id: string}>}) {
    const params = await props.params;
    const id = params.id.split("---");
    const practiceName = id[0].replace("%20", " ");
    const practitionerName = id[1].replace("%20", " ");
    const date = id[2];
    const startTime = id[3].replaceAll("%3A", ":");
    console.log(startTime);

    async function cancelAppt() {
        "use server";
        const cookieStore = await cookies();
        const bookedAppointmentId = parseInt(cookieStore.get("bookedAppointmentId")?.value ?? "");
        const appointmentId = parseInt(cookieStore.get("appointmentId")?.value ?? "");
        const result = await cancelAppointment(bookedAppointmentId, appointmentId);
        cookieStore.delete("bookedAppointmentId");
        cookieStore.delete("appointmentId");
        if (result === "Successfully cancelled appointment") {
            redirect("./success");
        } else {
            redirect("./failure");
        }
    }

    async function stopCancel() {
        "use server";
        const cookieStore2 = await cookies();
        cookieStore2.delete("bookedAppointmentId");
        cookieStore2.delete("appointmentId");
        redirect("/user/appointments");
    }

    return (
        <div className={styles.appointmentInfo}>
            <p>{practiceName}</p>
            <p>{practitionerName}</p>
            <p>{formatDate(date.toString())}</p>
            <p>{formatStartTime(startTime.toString())}</p><br></br>
            <p>Are you sure you want to cancel this appointment?</p><br></br>
            <CancelOptionButton yesFn={cancelAppt} noFn={stopCancel}></CancelOptionButton>
        </div>
    )
}