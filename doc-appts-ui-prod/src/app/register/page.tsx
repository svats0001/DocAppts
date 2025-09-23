'use client';

import { handleRegister, RegisterState } from "../lib/actions";
import { FormEvent, startTransition, useState } from "react";
import { useFormState } from "react-dom";
import styles from '@/app/register/register.module.css';

export default function Page() {
    const genders = ['Male', 'Female', 'Other'];
    const [registerCounter, setRegisterCounter] = useState(0);
    const initialState: RegisterState = {message: null, errors: {}}
    const [error, formAction, isPending] = useFormState<RegisterState, FormData>(handleRegister, initialState);

    function formOnChange(e: FormEvent<HTMLFormElement>) {
        setRegisterCounter(registerCounter+1);
        startTransition(() => formAction(new FormData(e.currentTarget)));
    }

    function submitFormHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("register_button");
        startTransition(() => formAction(new FormData(e.currentTarget, el)));
    }

    return (
        <div className={styles.registerForm}>
            {error.message !== "Successfully created user" ?
            <div>
            <h2>Create new account</h2><br></br>
            <form onChange={formOnChange} onSubmit={submitFormHandler}>
                <label><b>Email</b></label>&nbsp;&nbsp;
                <input type="text" id="email" name="email"></input><br></br><br></br>
                {error.errors?.email && error.errors?.email.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Password</b></label>&nbsp;&nbsp;
                <input type="password" id="password" name="password"></input><br></br><br></br>
                {error.errors?.password && error.errors?.password.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Confirm password</b></label>&nbsp;&nbsp;
                <input type="password" id="confirm_password" name="confirm_password"></input><br></br><br></br>
                {error.errors?.confirmPassword && error.errors?.confirmPassword.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>First name</b></label>&nbsp;&nbsp;
                <input type="text" id="first_name" name="first_name"></input><br></br><br></br>
                {error.errors?.firstName && error.errors?.firstName.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Last name</b></label>&nbsp;&nbsp;
                <input type="text" id="last_name" name="last_name"></input><br></br><br></br>
                {error.errors?.lastName && error.errors?.lastName.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Date of birth</b></label>&nbsp;&nbsp;
                <input type="date" id="dob" name="dob"></input><br></br><br></br>
                {error.errors?.dob && error.errors?.dob.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Gender</b></label>&nbsp;&nbsp;
                <select id="gender" name="gender">
                    <option disabled selected></option>
                    {genders.map((gender) => (
                        <option value={gender} key={gender}>{gender}</option>
                    ))}
                </select><br></br><br></br>
                {error.errors?.gender && error.errors?.gender.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Mobile</b></label>&nbsp;&nbsp;
                <input type="number" id="mobile" name="mobile"></input><br></br><br></br>
                {error.errors?.mobile && error.errors?.mobile.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                {(Object.keys(error.errors ?? {}).length == 0) && !isPending && registerCounter != 0 ? <><button type="submit" id="register_button" name="register_button" value="Register">Register</button><br></br><br></br></> :
                <><button type="submit" id="register_button" name="register_button" value="Register" disabled>Register</button><br></br><br></br></>}
                <p className={styles.errorMessage}>{error.message}</p>
            </form>
            </div> :
            <div>
                <h2>User successfully registered</h2>
            </div>}
        </div>
    )
}