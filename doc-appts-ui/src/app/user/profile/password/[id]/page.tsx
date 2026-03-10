'use client';

import { getPasswordResetLink, handlePasswordEdit, PasswordReset, RegisterState } from "@/app/lib/actions";
import { useFormState } from "react-dom";
import styles from "@/app/user/profile/userProfile.module.css";
import { FormEvent, startTransition, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';

export default function Page() {
    const searchParams = useSearchParams();
    const resetError = searchParams?.get('error') ? true : false;
    const [assessLink, setAssessLink] = useState<boolean | null>(null);
    let pathName = usePathname();
    pathName = pathName ? pathName.split("/").at(-1) ?? "" : "";
        useEffect(() => {
        const linkFn = async() => {
            const passwordReset: PasswordReset = await getPasswordResetLink(pathName!);
            if (passwordReset.urlLink) {
                Cookies.set('tmpUser', passwordReset.userId?.toString() ?? '');
                setAssessLink(false);
            } else {
                setAssessLink(true);
            }
        }
        linkFn();
    });

    const initialStatePassword: RegisterState = {message: null, errors: {}};
    const [counter, setCounter] = useState(0);
    const [errorPassword, formActionPassword, isPendingPassword] = useFormState<RegisterState, FormData>(handlePasswordEdit, initialStatePassword);

    function formOnChangePassword(e: FormEvent<HTMLFormElement>) {
            setCounter(counter+1);
            startTransition(() => formActionPassword(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerPassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("passwordEditButton");
        Cookies.set('urlLink', pathName ?? '');
        startTransition(() => formActionPassword(new FormData(e.currentTarget, el)));
    }

    return (
        <div className={styles.profileDetails}>
            {assessLink == null ? null :
            !assessLink ? <>
            <h3>Reset password</h3><br></br>
            {<>
            <form onChange={formOnChangePassword} onSubmit={submitFormHandlerPassword}>
            <label><b>Enter new password </b></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input name="password" type="password" id="password"></input><br></br>
            {errorPassword.errors?.password && errorPassword.errors?.password.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}<br></br>
            <label><b>Confirm new password</b></label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <input name="confirm_password" type="password" id="confirm_password"></input>&nbsp;<br></br><br></br>
            {errorPassword.errors?.confirmPassword && errorPassword.errors?.confirmPassword.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}
            {Object.keys(errorPassword.errors ?? {}).length != 0 || counter == 0 || isPendingPassword ? <button disabled>Submit</button> :
            <button id="passwordEditButton" name="passwordEditButton" type="submit" value="submit">Submit</button>}</form><br></br><br></br>
            {resetError ? <p className={styles.errorMessage}>Unable to reset password</p> : null}
            </>}</> : <p>Invalid password reset link</p>}
            </div>
    )
}