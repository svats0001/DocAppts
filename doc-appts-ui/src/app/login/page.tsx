'use client';

import { useFormState } from "react-dom";
import { handleLogin, LoginState } from "../lib/actions";
import styles from '@/app/login/login.module.css';
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    return (
        <Suspense>
        <Login></Login>
        </Suspense>
    )
}

function Login() {
    const searchParams = useSearchParams();
    const initialState: LoginState = searchParams?.get('submit') ? {message: "Invalid email and password", errors: {}} : {message: null, errors: {}}
    const [error, formAction, isPending] = useFormState<LoginState, FormData>(handleLogin, initialState);
    const router = useRouter();

    useEffect(() => {if (typeof window !== "undefined") {
        const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        if (sessionId) {
          const val = sessionId.pop();
          if (val !== "") {
            router.push("/login/success");
          }
        }
    }}, [error]);

    if (error?.message === "Invalid email and password") {
        toast(error?.message);
    }

    return (
        <div className={styles.loginForm}>
            {error?.message !== "Login successful" ?
            <div>
            <h2>Login</h2><br></br>
            <form action={formAction}>
                <label><b>Email</b></label>&nbsp;&nbsp;
                <input type="text" id="email" name="email"></input><br></br><br></br>
                <label><b>Password</b></label>&nbsp;&nbsp;
                <input type="password" id="password" name="password"></input><br></br><br></br>
                {!isPending ? <><button type="submit">Login</button><br></br><br></br></> : <><button type="submit" disabled>Login</button><br></br><br></br></>}
                {error?.message ? <><p className={styles.errorMessage}>{error?.message}</p><br></br><br></br></> : null}
                <p>Don&apos;t have an account? <Link href="/register" className={styles.linkStyle}>Create account</Link></p><br></br>
                <p><Link href="/login/reset" className={styles.linkStyle}>Forgot password?</Link></p>
            </form></div> :
            null}
        </div>
    )
}