'use client'

export default function Alert(props: {msg: string}) {
    alert(props.msg);
    return (
        <></>
    )
}

export function formatDate(date: string): string {
    const tmp = date.split("-");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", 
        "October", "November", "December"];
    return tmp[2]+" "+months[parseInt(tmp[1])]+" "+tmp[0];
}