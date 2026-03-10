'use client';

import { AvailableAppointment } from "@/app/search/search";
import styles from "@/app/practice/[id]/practitioner/[practitionerId]/practitioner.module.css";
import { ReactNode, useEffect, useState } from "react";
import { formatStartTime } from "@/app/practice/practitionerCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppointmentTable({availableAppointments, urlPath}: {availableAppointments: AvailableAppointment[], urlPath: string}) {
    const router = useRouter();
    const [dates, setDates] = useState<Date[]>([]);
    const [datesMap, setDatesMap] = useState(new Map<string,string[]>());
    const curDate: Date = new Date();
    const initDate: Date = availableAppointments.length > 0 ? new Date(availableAppointments[0].date!) : new Date();
    console.log(initDate);
    const dayDifference = Math.floor((initDate.getTime() - curDate.getTime())/(1000*60*60*24));
    const [maxRows,setMaxRows] = useState(0);
    const [curIndex, setCurIndex] = useState(0);
    const numColumns = 10;

    useEffect(() => {function initDates() {
    datesMap.set(initDate.getFullYear()+"-"+initDate.getMonth()+"-"+initDate.getDate(), []);
    dates.push(initDate);
    for (let i = 1; i < (180-dayDifference); i++) {
        const newDate = new Date(initDate);
        newDate.setTime(newDate.getTime() + (i*24*60*60*1000));
        dates.push(newDate);
        datesMap.set(newDate.getFullYear()+"-"+newDate.getMonth()+"-"+newDate.getDate(), []);
    };
    setDates(dates);
    setDatesMap(datesMap);
    for (let j = 0; j < availableAppointments.length; j++) {
        try {
            if (availableAppointments[j].date && availableAppointments[j].startTime) {
                const apptDate = new Date(availableAppointments[j].date || '');
                const apptDateString = apptDate.getFullYear()+"-"+apptDate.getMonth()+"-"+apptDate.getDate();
                if (datesMap.get(apptDateString)) {
                    let apptStartTimeString = availableAppointments[j].startTime?.toString() || '';
                    apptStartTimeString = formatStartTime(apptStartTimeString);
                    datesMap.get(apptDateString)?.push(apptStartTimeString);
                    setMaxRows(Math.max(maxRows, datesMap.get(apptDateString)?.length ?? 0));
                }
        }
        } catch (exc) {console.log(exc)};
    }
    } initDates();});

    function generateColumns() {
        const tableColumns = [];
        let keyIndex = 0;
        for (let l = curIndex; l < (curIndex+numColumns); l++) {
            if (l >= dates.length) {
                break;
            }
            tableColumns.push(<th className={styles.appointmentTable} key={keyIndex}>
                {dates[l].toDateString()}
            </th>);
            keyIndex++;
        }
        const table = [<thead key={keyIndex}><tr key={keyIndex+1}>{tableColumns}</tr></thead>];
        keyIndex+=2;
        const tableDataRows = [];
        for (let k = 0; k < maxRows; k++) {
            const tableData: ReactNode[] = [];
            let counter = 0;
            for (const [key, value] of datesMap.entries()) {
                if (counter >= curIndex && counter < (curIndex+numColumns)) {
                    if (value.length > k) {
                        tableData.push(<td key={keyIndex} className={styles.appointmentTableClickable} onClick={() => bookAppointment(key, value[k])}>{value[k]}</td>)
                    } else {
                        tableData.push(<td key={keyIndex} className={styles.appointmentTable}></td>);
                    }
                    keyIndex++;
                }
                counter++;
            }
            tableDataRows.push(<tr key={keyIndex}>{tableData}</tr>);
            keyIndex++;
        }
        table.push(<tbody key={keyIndex}>{tableDataRows}</tbody>)
        return table;
    }

    function scrollTable(right: boolean) {
        if (right) {
            setCurIndex(curIndex+numColumns);
        } else {
            setCurIndex(curIndex-numColumns);
        }
    }

    function bookAppointment(date: string, startTime: string) {
        console.log("Inside book appt");
        if (typeof window !== "undefined") {
            const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
            if (sessionId) {
                const val = sessionId.pop();
                if (val !== "") {
                  startTime = convertStartTime(startTime.toString());
                  router.push(urlPath + "/appointment/"+date+"---"+startTime);
                  return undefined;
                  }
                }
        }
        alert("You must be logged in to book an appointment");
        return undefined;
    }

    function convertStartTime(startTime: string) {
        const splitStartTime = startTime.split(" ");
        const time = splitStartTime[0].split(":");
        let result = "";
        if (splitStartTime[1] === "AM") {
            if (parseInt(time[0]) == 12) {
                result = "00:" + time[1];
            } else {
                result = time[0] + ":" + time[1];
            }
        } else {
            if (parseInt(time[0]) !== 12) {
                const tmp = 12 + parseInt(time[0]);
                result = tmp + ":" + time[1];
            } else {
                result = time[0] + ":" + time[1];
            }
        }
        return result;
    }

    return (
        <div className={styles.appointmentTable}>
        <h4>Available appointments</h4><br></br>
        <button disabled={curIndex == 0} onClick={() => scrollTable(false)} className={styles.leftButton}><Image src="/black_left.png" alt="Scroll left" width={50} height={40}></Image></button>&nbsp;
        <button disabled={curIndex >= (dates.length-numColumns)} onClick={() => scrollTable(true)} className={styles.rightButton}><Image src="/black_right.png" alt="Scroll right" width={50} height={40}></Image></button><br></br><br></br>
        <table>
            {generateColumns()}
        </table>
        </div>
    )
}