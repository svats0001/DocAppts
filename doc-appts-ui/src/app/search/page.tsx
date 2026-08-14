'use client';

import { Suspense, use, useEffect, useState } from "react";
import { getPractices } from "../lib/actions";
import Search, { Practice } from "./search";

export default function Page() {
    const [practices, setPractices] = useState<Practice[]>([]);
    const [remountCounter, setRemountCounter] = useState(0);
    const [err, setErr] = useState(false);
    console.log("Practices=");
    console.log(practices);
    useEffect(() => {
        const fetchPractices = async() => {
            console.log("Practices API fetch started");
            setPractices(await getPractices());
            setRemountCounter(remountCounter+1);
        };
        fetchPractices();
    }, []);

    /*try {
        console.log("Practices API fetch started");
            /*const data = await fetch("http://localhost:3000/api/practices");
        practices = await getPractices();
        console.log(practices);
        } catch (exc) {
            console.log(exc);
            err = true;  
    };*/

    return (
        <div>
            <Search practices={practices} err={false} remountCounter={remountCounter} key={remountCounter}></Search>
        </div>
    )
}