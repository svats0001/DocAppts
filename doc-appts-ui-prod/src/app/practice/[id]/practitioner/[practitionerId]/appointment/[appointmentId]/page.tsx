import { getPractitionerByEmailAndMobile, bookAppointmentServer } from "@/app/lib/actions";
import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import { redirect } from "next/navigation";
import SubmitBook from "./submitBook";
import { formatStartTime } from "@/app/practice/practitionerCard";
import { cookies } from "next/headers";
import { formatDate } from "./alert";

type ApptUrl = {
    id: string,
    practitionerId: string,
    appointmentId: string
}

export default async function Page(props: {params: Promise<ApptUrl>}) {
    const params = await props.params;
    const res = params.practitionerId.split("---");
    const practitioner = await getPractitionerByEmailAndMobile(res[0], res[1]);
    const lastIndex = res[0].lastIndexOf("%40");
    if (lastIndex !== -1) {
        res[0] = res[0].substring(0, lastIndex) + "@" + res[0].substring(lastIndex+3, res[0].length);
    }
    const practiceId = params.id.split("---");
    practiceId[0] = practiceId[0].replace("%20", " ");
    const appointment: string[] = params.appointmentId.split("---");
    appointment[1] = appointment[1].replace("%3A", ":");
    const formattedAppointmentTime = formatStartTime(appointment[1]);
    const formattedDate: string = formatDate(appointment[0]);
    const initialDateForServer = appointment[0].split("-");
    initialDateForServer[1] = (parseInt(initialDateForServer[1])+1).toString();
    if (initialDateForServer[1].length < 2) {
        initialDateForServer[1] = "0" + initialDateForServer[1];
    }
    if (initialDateForServer[2].length < 2) {
        initialDateForServer[2] = "0" + initialDateForServer[2];
    }
    const finalDateForServer = initialDateForServer[0]+"-"+initialDateForServer[1]+"-"+initialDateForServer[2];
    const finalTimeForServer = appointment[1]+":00";

    async function bookAppointment() {
        "use server";
        const cookieStore = await cookies();
            const sessionId = cookieStore.get("sessionId");
            if (sessionId) {
                const val = sessionId.value || '';
                if (val !== "") {
                    const userId = cookieStore.get("userId")?.value || '';
                    if (practitioner.id === null) {
                        return;
                    }
                    const bookedStatus = await bookAppointmentServer(val, userId, practiceId[0], practiceId[1],
                        practitioner.id, finalDateForServer, finalTimeForServer);
                    if (bookedStatus === "Successfully booked appointment") {
                        redirect("./booked/success")
                    }
                }
                }
            else {
                redirect("./booked/userError")
            }
            redirect("./booked/systemError");
    }

    return (
        <div className={styles.practitionerInfo}>
            <h3>Book appointment</h3><br></br>
            <p>{practiceId[0]}</p>
            <p>{practitioner.firstName + " " + practitioner.lastName}</p>
            <p>{formattedDate}</p>
            <p>{formattedAppointmentTime}</p><br></br>
            <SubmitBook submitFn={bookAppointment}></SubmitBook>
        </div>
    )
}