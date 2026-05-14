'use client';

import { createPracticePasswordResetLink, getPracticeByPracticeId, handlePracticeAddressEdit, handlePracticeBillingEdit, handlePracticeDescriptionEdit, handlePracticeEmailEdit, handlePracticeNameEdit, handlePracticePhoneEdit, handlePracticeSpecialtyEdit, PracticePasswordReset, PracticeRegisterState } from "@/app/lib/actions";
import { sendMail } from "@/app/lib/sendMail";
import { Practice } from "@/app/search/search";
import { useSearchParams } from "next/navigation";
import { FormEvent, startTransition, Suspense, useActionState, useEffect, useState } from "react";
import styles from '@/app/practice/practice.module.css';

export default function Page() {
    return (
        <Suspense>
        <PracticeProfile></PracticeProfile>
        </Suspense>
    )
}

export function PracticeProfile() {
    const specialties = ["General Practitioner", "Iron Infusions", "Gastroenterologist", "Neurologist", "Hematologist", "Endocrinologist"];
    const billings = ['Bulk billed', 'Mixed', 'No bulk billing'];
    const exceptions = ["A practice with this email address already exists", "Server error, try again later"];
    const searchParams = useSearchParams();
    const submitError = searchParams?.get('err') ? exceptions[parseInt(searchParams.get('err') ?? '')] : null;

    const [showNameEdit, setShowNameEdit] = useState(false);
    const [showAddressEdit, setShowAddressEdit] = useState(false);
    const [showDescriptionEdit, setShowDescriptionEdit] = useState(false);
    const [showBillingEdit, setShowBillingEdit] = useState(false);
    const [showSpecialtyEdit, setShowSpecialtyEdit] = useState(false);
    const [showPhoneEdit, setShowPhoneEdit] = useState(false);
    const [showEmailEdit, setShowEmailEdit] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState('');
    const [practiceData, setPracticeData] = useState<Practice>({});
    const [isLoading, setIsLoading] = useState(false);

    const [emailCounter, setEmailCounter] = useState(0);
    const [nameCounter, setNameCounter] = useState(0);
    const [addressCounter, setAddressCounter] = useState(0);
    const [descriptionCounter, setDescriptionCounter] = useState(0);
    const [billingCounter, setBillingCounter] = useState(0);
    const [specialtyCounter, setSpecialtyCounter] = useState(0);
    const [phoneCounter, setPhoneCounter] = useState(0);

    const initialStateEmail: PracticeRegisterState = {message: null, errors: {}};
    const [errorEmail, formActionEmail, isPendingEmail] = useActionState<PracticeRegisterState, FormData>(handlePracticeEmailEdit, initialStateEmail);
    const initialStateName: PracticeRegisterState = {message: null, errors: {}};
    const [errorName, formActionName, isPendingName] = useActionState<PracticeRegisterState, FormData>(handlePracticeNameEdit, initialStateName);
    const initialStateAddress: PracticeRegisterState = {message: null, errors: {}};
    const [errorAddress, formActionAddress, isPendingAddress] = useActionState<PracticeRegisterState, FormData>(handlePracticeAddressEdit, initialStateAddress);
    const initialStateDescription: PracticeRegisterState = {message: null, errors: {}};
    const [errorDescription, formActionDescription, isPendingDescription] = useActionState<PracticeRegisterState, FormData>(handlePracticeDescriptionEdit, initialStateDescription);
    const initialStateBilling: PracticeRegisterState = {message: null, errors: {}};
    const [errorBilling, formActionBilling, isPendingBilling] = useActionState<PracticeRegisterState, FormData>(handlePracticeBillingEdit, initialStateBilling);
    const initialStateSpecialty: PracticeRegisterState = {message: null, errors: {}};
    const [errorSpecialty, formActionSpecialty, isPendingSpecialty] = useActionState<PracticeRegisterState, FormData>(handlePracticeSpecialtyEdit, initialStateSpecialty);
    const initialStatePhone: PracticeRegisterState = {message: null, errors: {}};
    const [errorPhone, formActionPhone, isPendingPhone] = useActionState<PracticeRegisterState, FormData>(handlePracticePhoneEdit, initialStatePhone);

    useEffect(() => {const fetchData = async() => {
        const practiceId = document.cookie.match("(^|;)\\s*" + "practiceId" + "\\s*=\\s*([^;]+)");
        const practiceSessionId = document.cookie.match("(^|;)\\s*" + "practiceSessionId" + "\\s*=\\s*([^;]+)");
        if (practiceId) {
            const data = await getPracticeByPracticeId(practiceId.pop() ?? '', practiceSessionId?.pop() ?? '');
            setPracticeData(data);
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

    function formOnChangeName(e: FormEvent<HTMLFormElement>) {
        setNameCounter(nameCounter+1);
        startTransition(() => formActionName(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerName(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("nameEditButton");
        startTransition(() => formActionName(new FormData(e.currentTarget, el)));
    }

    function formOnChangeAddress(e: FormEvent<HTMLFormElement>) {
        setAddressCounter(addressCounter+1);
        startTransition(() => formActionAddress(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerAddress(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("addressEditButton");
        startTransition(() => formActionAddress(new FormData(e.currentTarget, el)));
    }

    function formOnChangeDescription(e: FormEvent<HTMLFormElement>) {
        setDescriptionCounter(descriptionCounter+1);
        startTransition(() => formActionDescription(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerDescription(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("descriptionEditButton");
        startTransition(() => formActionDescription(new FormData(e.currentTarget, el)));
    }

    function formOnChangeBilling(e: FormEvent<HTMLFormElement>) {
        setBillingCounter(billingCounter+1);
        startTransition(() => formActionBilling(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerBilling(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("billingEditButton");
        startTransition(() => formActionBilling(new FormData(e.currentTarget, el)));
    }

    function formOnChangeSpecialty(e: FormEvent<HTMLFormElement>) {
        setSpecialtyCounter(specialtyCounter+1);
        startTransition(() => formActionSpecialty(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerSpecialty(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("specialtyEditButton");
        startTransition(() => formActionSpecialty(new FormData(e.currentTarget, el)));
    }

    function formOnChangePhone(e: FormEvent<HTMLFormElement>) {
        setPhoneCounter(phoneCounter+1);
        startTransition(() => formActionPhone(new FormData(e.currentTarget)));
    }
        
    function submitFormHandlerPhone(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const el = document.getElementById("phoneEditButton");
        startTransition(() => formActionPhone(new FormData(e.currentTarget, el)));
    }

    function toggleShowEmail() {
        setShowEmailEdit(!showEmailEdit);
        const el = document.getElementById("email");
        if (el) {
            el!.innerText = practiceData.email?.toString() || '';
        }
    }

    function toggleShowName() {
        setShowNameEdit(!showNameEdit);
        const el = document.getElementById("name");
        if (el) {
            el!.innerText = practiceData.name?.toString() || '';
        }
    }

    function toggleShowAddress() {
        setShowAddressEdit(!showAddressEdit);
        const el = document.getElementById("address");
        if (el) {
            el!.innerText = practiceData.address?.toString() || '';
        }
    }

    function toggleShowDescription() {
        setShowDescriptionEdit(!showDescriptionEdit);
        const el = document.getElementById("description");
        if (el) {
            el!.innerText = practiceData.description?.toString() || '';
        }
    }

    function toggleShowBilling() {
        setShowBillingEdit(!showBillingEdit);
        const el = document.getElementById("billing");
        if (el) {
            el!.nodeValue = practiceData.billing?.toString() || '';
        }
    }

    function toggleShowSpecialty() {
        setShowSpecialtyEdit(!showSpecialtyEdit);
        const el = document.getElementById("specialty");
        if (el) {
            el!.nodeValue = practiceData.specialty?.toString() || '';
        }
    }

    function toggleShowPhone() {
        setShowPhoneEdit(!showPhoneEdit);
        const el = document.getElementById("phone");
        if (el) {
            el!.innerText = practiceData.phone?.toString() || '';
        }
    }

    async function createPasswordReset() {
        setIsLoading(true);
        const resetLink: PracticePasswordReset = await createPracticePasswordResetLink();
        if (resetLink.urlLink) {
            const emailResult = await sendMail({email: process.env.NEXT_PUBLIC_SMTP_SERVER_USERNAME ?? '',
                sendTo: practiceData.email, subject: 'DocAppts password reset',
                text: 'Follow this link to reset password: https://localhost:3000/practice/passwordReset/'+resetLink.urlLink+' . Reset link expires in 60 minutes.'
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
        <div className={styles.practiceInfo}>
            <h3>Profile details</h3><br></br><br></br>
            <label><b>Email: </b>{practiceData ? practiceData.email : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowEmail()}>Edit</button>&nbsp;
            {showEmailEdit ? <>
            <form onChange={formOnChangeEmail} onSubmit={submitFormHandlerEmail}>
            <input id="email" name="email" defaultValue={practiceData ? practiceData.email : undefined}></input>&nbsp;
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
            <label><b>Name: </b>{practiceData ? practiceData.name : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowName()}>Edit</button>&nbsp;
            {showNameEdit ? <>
            <form onChange={formOnChangeName} onSubmit={submitFormHandlerName}>
            <input name="name" id="name" defaultValue={practiceData ? practiceData.name : undefined}></input>&nbsp;
            {nameCounter == 0 || isPendingName || Object.keys(errorName.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="nameEditButton" name="nameEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorName.errors?.name && errorName.errors?.name.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Address: </b>{practiceData ? practiceData.address : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowAddress()}>Edit</button>&nbsp;
            {showAddressEdit ? <>
            <form onChange={formOnChangeAddress} onSubmit={submitFormHandlerAddress}>
            <input name="address" id="address" defaultValue={practiceData ? practiceData.address : undefined}></input>&nbsp;
            {addressCounter == 0 || isPendingAddress || Object.keys(errorAddress.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="addressEditButton" name="addressEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorAddress.errors?.address && errorAddress.errors?.address.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Description: </b>{practiceData?.description ? practiceData.description.toString() : ""}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowDescription()}>Edit</button>&nbsp;
            {showDescriptionEdit ? <>
            <form onChange={formOnChangeDescription} onSubmit={submitFormHandlerDescription}>
            <textarea name="description" id="date" defaultValue={practiceData ? practiceData.description?.toString() : undefined}></textarea>&nbsp;
            {descriptionCounter == 0 || isPendingDescription || Object.keys(errorDescription.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="descriptionEditButton" name="descriptionEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorDescription.errors?.description && errorDescription.errors?.description.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Billing: </b>{practiceData ? practiceData.billing : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowBilling()}>Edit</button>&nbsp;
            {showBillingEdit ? <>
            <form onChange={formOnChangeBilling} onSubmit={submitFormHandlerBilling}>
            <select id="billing" name="billing" defaultValue={practiceData ? practiceData.billing : undefined}>
                {billings.map((billing) => (
                    <option value={billing} key={billing}>{billing}</option>
                ))}
            </select><br></br><br></br>&nbsp;
            {billingCounter == 0 || isPendingBilling || Object.keys(errorBilling.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="billingEditButton" name="billingEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorBilling.errors?.billing && errorBilling.errors?.billing.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Specialty: </b>{practiceData ? practiceData.specialty : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowSpecialty()}>Edit</button>&nbsp;
            {showSpecialtyEdit ? <>
            <form onChange={formOnChangeSpecialty} onSubmit={submitFormHandlerSpecialty}>
            <select id="specialty" name="specialty" defaultValue={practiceData ? practiceData.specialty : undefined}>
                {specialties.map((specialty) => (
                    <option value={specialty} key={specialty}>{specialty}</option>
                ))}
            </select><br></br><br></br>&nbsp;
            {specialtyCounter == 0 || isPendingSpecialty || Object.keys(errorSpecialty.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="specialtyEditButton" name="specialtyEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorSpecialty.errors?.specialty && errorSpecialty.errors?.specialty.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            <label><b>Phone: </b>{practiceData ? practiceData.phone : null}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => toggleShowPhone()}>Edit</button>&nbsp;
            {showPhoneEdit ? <>
            <form onChange={formOnChangePhone} onSubmit={submitFormHandlerPhone}>
            <input name="phone" id="phone" defaultValue={practiceData ? practiceData.phone : undefined}></input>&nbsp;
            {phoneCounter == 0 || isPendingPhone || Object.keys(errorPhone.errors ?? {}).length > 0 ?
            <button disabled>Submit</button> :
            <button id="phoneEditButton" name="phoneEditButton" type="submit" value="submit">Submit</button>}</form><br></br>
            {errorPhone.errors?.phone && errorPhone.errors?.phone.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
            ))}</> : <><br></br><br></br></>}
            {submitError ? <p className={styles.errorMessage}>{submitError}</p> : null}
        </div>
    )
}