'use client';

import { createPasswordResetLink, getUserByUserId, handleDobEdit, handleEmailEdit, handleFirstNameEdit, handleGenderEdit, handleLastNameEdit, handleMobileEdit, PasswordReset, RegisterState, User } from "@/app/lib/actions";
import { FormEvent, startTransition, Suspense, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import styles from "@/app/user/profile/userProfile.module.css";
import { formatDate } from "../appointments/cancelButton";
import { sendMail } from "@/app/lib/sendMail";
import { useSearchParams } from "next/navigation";

export default function Page() {
    return (
        <Suspense>
            <Profile></Profile>
        </Suspense>
    )
}

function Profile() {
    const genders = ['Male', 'Female', 'Other'];
    const exceptions = ["A user with this email address already exists", "Server error, try again later"];
    const searchParams = useSearchParams();
    const submitError = searchParams?.get('err') ? exceptions[parseInt(searchParams.get('err') ?? '')] : null;

    const [showEmailEdit, setShowEmailEdit] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState('');
    const [showFirstNameEdit, setShowFirstNameEdit] = useState(false);
    const [showLastNameEdit, setShowLastNameEdit] = useState(false);
    const [showDobEdit, setShowDobEdit] = useState(false);
    const [showGenderEdit, setShowGenderEdit] = useState(false);
    const [showMobileEdit, setShowMobileEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [emailCounter, setEmailCounter] = useState(0);
    const [firstNameCounter, setFirstNameCounter] = useState(0);
    const [lastNameCounter, setLastNameCounter] = useState(0);
    const [dobCounter, setDobCounter] = useState(0);
    const [genderCounter, setGenderCounter] = useState(0);
    const [mobileCounter, setMobileCounter] = useState(0);

    const [userData, setUserData] = useState<User>({});
    const initialStateEmail: RegisterState = {message: null, errors: {}}
    const [errorEmail, formActionEmail, isPendingEmail] = useFormState<RegisterState, FormData>(handleEmailEdit, initialStateEmail);
    const initialStateFirstName: RegisterState = {message: null, errors: {}}
    const [errorFirstName, formActionFirstName, isPendingFirstName] = useFormState<RegisterState, FormData>(handleFirstNameEdit, initialStateFirstName);
    const initialStateLastName: RegisterState = {message: null, errors: {}}
    const [errorLastName, formActionLastName, isPendingLastName] = useFormState<RegisterState, FormData>(handleLastNameEdit, initialStateLastName);
    const initialStateDob: RegisterState = {message: null, errors: {}}
    const [errorDob, formActionDob, isPendingDob] = useFormState<RegisterState, FormData>(handleDobEdit, initialStateDob);
    const initialStateGender: RegisterState = {message: null, errors: {}}
    const [errorGender, formActionGender, isPendingGender] = useFormState<RegisterState, FormData>(handleGenderEdit, initialStateGender);
    const initialStateMobile: RegisterState = {message: null, errors: {}}
    const [errorMobile, formActionMobile, isPendingMobile] = useFormState<RegisterState, FormData>(handleMobileEdit, initialStateMobile);

    useEffect(() => {const fetchData = async() => {
        console.log("In effect");
        const match = document.cookie.match("(^|;)\\s*" + "userId" + "\\s*=\\s*([^;]+)");
        const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        if (match) {
            const data = await getUserByUserId(match.pop() ?? '', sessionId?.pop() ?? '');
            setUserData(data);
        }
    }; fetchData();}, []);

    function formOnChangeEmail(e: FormEvent<HTMLFormElement>) {
        setEmailCounter(emailCounter+1);
            startTransition(() => formActionEmail(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("emailEditButton");
        startTransition(() => formActionEmail(new FormData(e.currentTarget, el)));
    }

    function formOnChangeFirstName(e: FormEvent<HTMLFormElement>) {
        setFirstNameCounter(firstNameCounter+1);
            startTransition(() => formActionFirstName(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerFirstName(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("firstNameEditButton");
        startTransition(() => formActionFirstName(new FormData(e.currentTarget, el)));
    }

    function formOnChangeLastName(e: FormEvent<HTMLFormElement>) {
        setLastNameCounter(lastNameCounter+1);
            startTransition(() => formActionLastName(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerLastName(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("lastNameEditButton");
        startTransition(() => formActionLastName(new FormData(e.currentTarget, el)));
    }

    function formOnChangeDob(e: FormEvent<HTMLFormElement>) {
        setDobCounter(dobCounter+1);
            startTransition(() => formActionDob(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerDob(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("dobEditButton");
        startTransition(() => formActionDob(new FormData(e.currentTarget, el)));
    }

    function formOnChangeGender(e: FormEvent<HTMLFormElement>) {
        setGenderCounter(genderCounter+1);
            startTransition(() => formActionGender(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerGender(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("genderEditButton");
        startTransition(() => formActionGender(new FormData(e.currentTarget, el)));
    }

    function formOnChangeMobile(e: FormEvent<HTMLFormElement>) {
        setMobileCounter(mobileCounter+1);
            startTransition(() => formActionMobile(new FormData(e.currentTarget)));
        }
    
    function submitFormHandlerMobile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("mobileEditButton");
        startTransition(() => formActionMobile(new FormData(e.currentTarget, el)));
    }

    function toggleShowEmail() {
        setShowEmailEdit(!showEmailEdit);
        const el = document.getElementById("email");
        if (el) {
            el!.innerText = userData.email?.toString() || '';
        }
    }

    function toggleShowFirstName() {
        setShowFirstNameEdit(!showFirstNameEdit);
        const el = document.getElementById("first_name");
        if (el) {
            el!.innerText = "";
        }
    }

    function toggleShowLastName() {
        setShowLastNameEdit(!showLastNameEdit);
        const el = document.getElementById("last_name");
        if (el) {
            el!.innerText = "";
        }
    }

    function toggleShowDob() {
        setShowDobEdit(!showDobEdit);
        const el = document.getElementById("dob");
        if (el) {
            el!.innerText = "";
        }
    }

    function toggleShowGender() {
        setShowGenderEdit(!showGenderEdit);
        const el = document.getElementById("gender");
        if (el) {
            el!.innerText = "";
        }
    }

    function toggleShowMobile() {
        setShowMobileEdit(!showMobileEdit);
        const el = document.getElementById("mobile");
        if (el) {
            el!.innerText = "";
        }
    }

    async function createPasswordReset() {
        setIsLoading(true);
        const resetLink: PasswordReset = await createPasswordResetLink();
        if (resetLink.urlLink) {
            console.log(process.env.NEXT_PUBLIC_SMTP_SERVER_USERNAME);
            console.log(process.env.NEXT_PUBLIC_SITE_MAIL_RECEIVER);
        const emailResult = await sendMail({email: process.env.NEXT_PUBLIC_SMTP_SERVER_USERNAME ?? '',
            sendTo: process.env.NEXT_PUBLIC_SITE_MAIL_RECEIVER, subject: 'DocAppts password reset',
            text: 'Follow this link to reset password: https://localhost:3000/user/profile/password/'+resetLink.urlLink+' . Reset link expires in 60 minutes.'
        });
        if (emailResult) {
            setShowPasswordEdit('Password reset link sent');
        } else {
            setShowPasswordEdit('Error in sending email');
        }} else {
            setShowPasswordEdit('User not logged in');
        }
        setIsLoading(false);
    }

    return (
        <div className={styles.profileDetails}>
            <h3>Profile details</h3><br></br><br></br>
            <label><b>Email: </b>{userData ? userData.email : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowEmail()}>Edit</button>&nbsp;
            {showEmailEdit ? <>
            <form onChange={formOnChangeEmail} onSubmit={submitFormHandlerEmail}>
            <input id="email" name="email" defaultValue={userData ? userData.email : undefined}></input>&nbsp;
            {emailCounter == 0 || isPendingEmail || Object.keys(errorEmail.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> : 
            <button id="emailEditButton" name="emailEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorEmail.errors?.email && errorEmail.errors?.email.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}
            </> : <><br></br><br></br></>}
            {showPasswordEdit == '' ? <>
            <label><b>Password: </b>********</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {!isLoading ? 
            <button onClick={() => createPasswordReset()}>Edit</button> : <button disabled>Edit</button>}&nbsp;</> : <p>{showPasswordEdit}</p>}
            <br></br><br></br>
            <label><b>First name: </b>{userData ? userData.firstName : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowFirstName()}>Edit</button>&nbsp;
            {showFirstNameEdit ? <>
            <form onChange={formOnChangeFirstName} onSubmit={submitFormHandlerFirstName}>
            <input name="first_name" id="first_name" defaultValue={userData ? userData.firstName : undefined}></input>&nbsp;
            {firstNameCounter == 0 || isPendingFirstName || Object.keys(errorFirstName.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="firstNameEditButton" name="firstNameEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorFirstName.errors?.firstName && errorFirstName.errors?.firstName.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Last name: </b>{userData ? userData.lastName : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowLastName()}>Edit</button>&nbsp;
            {showLastNameEdit ? <>
            <form onChange={formOnChangeLastName} onSubmit={submitFormHandlerLastName}>
            <input name="last_name" id="last_name" defaultValue={userData ? userData.lastName : undefined}></input>&nbsp;
            {lastNameCounter == 0 || isPendingLastName || Object.keys(errorLastName.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="lastNameEditButton" name="lastNameEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorLastName.errors?.lastName && errorLastName.errors?.lastName.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Date of birth: </b>{formatDate(userData?.dob ? userData.dob.toString() : "")}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowDob()}>Edit</button>&nbsp;
            {showDobEdit ? <>
            <form onChange={formOnChangeDob} onSubmit={submitFormHandlerDob}>
            <input name="dob" type="date" id="date" defaultValue={userData ? userData.dob?.toString() : undefined}></input>&nbsp;
            {dobCounter == 0 || isPendingDob || Object.keys(errorDob.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="dobEditButton" name="dobEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorDob.errors?.dob && errorDob.errors?.dob.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Gender: </b>{userData ? userData.gender : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowGender()}>Edit</button>&nbsp;
            {showGenderEdit ? <>
            <form onChange={formOnChangeGender} onSubmit={submitFormHandlerGender}>
            <select id="gender" name="gender" defaultValue={userData ? userData.gender : undefined}>
                {genders.map((gender) => (
                    <option value={gender} key={gender}>{gender}</option>
                ))}
            </select><br></br><br></br>&nbsp;
            {genderCounter == 0 || isPendingGender || Object.keys(errorGender.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="genderEditButton" name="genderEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorGender.errors?.gender && errorGender.errors?.gender.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Mobile: </b>{userData ? userData.mobile : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowMobile()}>Edit</button>&nbsp;
            {showMobileEdit ? <>
            <form onChange={formOnChangeMobile} onSubmit={submitFormHandlerMobile}>
            <input name="mobile" id="mobile" defaultValue={userData ? userData.mobile : undefined}></input>&nbsp;
            {mobileCounter == 0 || isPendingMobile || Object.keys(errorMobile.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="mobileEditButton" name="mobileEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorMobile.errors?.mobile && errorMobile.errors?.mobile.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            {submitError ? <p className={styles.errorMessage}>{submitError}</p> : null}
        </div>
    )
}