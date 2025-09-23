'use client';

import { UserAppointment } from "@/app/lib/actions";

export default function CancelButton(props: {cancelFn: (a: UserAppointment) => void, val: UserAppointment}) {
    return (
        <button onClick={() => props.cancelFn(props.val)}>Cancel appointment</button>
    )
}

export function formatDate(date: string): string {
    if (date === "") {
        return "";
    }
    const tmp: string[] = date.split("-");
    const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"];
    return tmp[2]+" "+months[parseInt(tmp[1])-1]+" "+tmp[0];
}