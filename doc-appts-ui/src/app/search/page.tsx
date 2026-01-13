export const dynamic = 'force-dynamic';

import { getPractices } from "../lib/actions";
import Search, { Practice } from "./search";

export default async function Page() {
    let practices: Practice[] = [];
    let err: boolean = false;
    try {
        console.log("Practices API fetch started");
            /*const data = await fetch("http://localhost:3000/api/practices");*/
        practices = await getPractices();
        console.log(practices);
        } catch (exc) {
            console.log(exc);
            err = true;  
    };

    return (
        <div>
            <Search practices={practices} err={err}></Search>
        </div>
    )
}