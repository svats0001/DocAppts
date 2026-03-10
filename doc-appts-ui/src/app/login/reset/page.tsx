'use client';

import { handleEmailPasswordEdit, RegisterState } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import styles from '@/app/login/login.module.css';
import { FormEvent, startTransition, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const [emailCounter, setEmailCounter] = useState(0);
    const initialStateEmail: RegisterState = {message: null, errors: {}}
    const [errorEmail, formActionEmail, isPendingEmail] = useFormState<RegisterState, FormData>(handleEmailPasswordEdit, initialStateEmail);
    const searchParams = useSearchParams();
    const practice = searchParams?.get('practice');

    function emailFieldChange(e: FormEvent<HTMLFormElement>) {
        setEmailCounter(emailCounter+1);
        startTransition(() => formActionEmail(new FormData(e.currentTarget)));
    }
        
    function emailFieldSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        var el: HTMLElement | null;
        if (practice === "False") {
            el = document.getElementById("emailEditButton");
        } else {
            el = document.getElementById("practiceEmailEditButton");
        }
        startTransition(() => formActionEmail(new FormData(e.currentTarget, el)));
    }

    return (
        <div className={styles.loginForm}>
            <h3>Password reset</h3><br></br>
            <form onChange={emailFieldChange} onSubmit={emailFieldSubmit}>
                <label><b>Email: </b></label>&nbsp;
                <input name="email" id="email" type="text"></input><br></br><br></br>
                {errorEmail.errors?.email && errorEmail.errors?.email.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                {emailCounter == 0 || isPendingEmail || Object.keys(errorEmail.errors ?? {}).length > 0 ?
                <button disabled>Submit</button> : practice === "False" ?
                <button type="submit" id="emailEditButton" name="emailEditButton" value="submit">Submit</button> :
                <button type="submit" id="practiceEmailEditButton" name="practiceEmailEditButton" value="submit">Submit</button>}
            </form>
        </div>
    )
}