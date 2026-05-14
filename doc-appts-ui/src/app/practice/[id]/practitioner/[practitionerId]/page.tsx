import { getAppointmentByPracticeIdAndPractitionerId, getPracticeByPublicId, getPractitionerByPublicId } from "@/app/lib/actions";
import { Appointment, Practice, Practitioner } from "@/app/search/search";
import Image from "next/image";
import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import AppointmentTable from "./appointment-table";

export default async function Page({ searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>}
) {
    /*const params = await props.params;
    const res = params.practitionerId.split("---");
    const lastIndex = res[0].lastIndexOf("%40");
    if (lastIndex !== -1) {
        res[0] = res[0].substring(0, lastIndex) + "@" + res[0].substring(lastIndex+3, res[0].length);
    }*/
    const params = await searchParams;
    const practitionerParam = params.practitioner;
    const practiceParam = params.practice;
    const dates: Date[] = [];
    const initDate: Date = new Date();
    dates.push(initDate);
    for (let i = 1; i < 180; i++) {
        const newDate = new Date(initDate);
        newDate.setTime(newDate.getTime() + (i*24*60*60*1000));
        dates.push(newDate);
    } 
    let practitioner: Practitioner = {};
    try {
        practitioner = await getPractitionerByPublicId(practitionerParam!);
        console.log(practitioner);
    } catch (exc) {
        console.log(exc);
    };
    /*const resPractice = params.id.split("---");
    resPractice[0] = resPractice[0].replace("%20", " ");*/
    let practice: Practice = {};
    try {
        practice = await getPracticeByPublicId(practiceParam!);
    } catch (exc) {
        console.log(exc);
    };
    let appointment: Appointment = {};
    try {
        if (practice.id !== undefined && practitioner.id !== undefined) {
            appointment = await getAppointmentByPracticeIdAndPractitionerId(practice.id, practitioner.id);
            practitioner.appointments = appointment;
        }
    } catch (exc) {
        console.log(exc);
    };

    return (
        <div className={styles.practitionerInfo}>
            <Image src={"/"+practitioner.photoPath} alt={(practitioner.firstName || '') +(practitioner.lastName || '') +" photo" || ''} width={100} height={100}></Image><br></br>
            <h3>{practitioner.firstName + ' ' + practitioner.lastName}</h3>
            <p>{practitioner.specialty}</p><br></br>
            <p>Email: {practitioner.email}</p>
            <p>Mobile: {practitioner.mobile}</p><br></br>
            <p>{practitioner.description}</p><br></br><br></br>
            <AppointmentTable availableAppointments={practitioner.appointments?.availableAppointmentsDTO || []} urlPath={"/practice/"+practice.name+"/practitioner/"+practitioner.firstName+" "+practitioner.lastName}></AppointmentTable>
        </div>
    )
}