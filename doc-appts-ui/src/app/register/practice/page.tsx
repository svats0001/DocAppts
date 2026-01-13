'use client';

import { createPractice, PracticeRegisterState } from '@/app/lib/actions';
import styles from '@/app/register/register.module.css';
import { FormEvent, startTransition, useActionState, useState } from 'react';
import locationData from '@/app/data/melbournelocations.json';
import { specialties } from '@/app/search/search';

export const billings = ['Bulk billed', 'Mixed', 'No bulk billing'] as const;

export default function Page() {
    const addresses = locationData.locations;
    const initialState: PracticeRegisterState = {message: null, errors: {}};
    const [error, formAction, isPending] = useActionState<PracticeRegisterState, FormData>(createPractice, initialState);
    const [editCounter, setEditCounter] = useState(0);

    function formOnChange(e: FormEvent<HTMLFormElement>) {
        setEditCounter(editCounter+1);
        startTransition(() => formAction(new FormData(e.currentTarget)));
    }
    
    function submitFormHandler(e: FormEvent<HTMLFormElement>) {
        console.log('Submitting...');
        e.preventDefault();
        const el = document.getElementById("create_practice_button");
        startTransition(() => formAction(new FormData(e.currentTarget, el)));
    }

    return (
        <div className={styles.registerForm}>
            {error.message !== "Practice successfully created" ?
            <>
            <h2>List your practice</h2><br></br>
            <form onChange={formOnChange} onSubmit={submitFormHandler}>
                <label><b>Name</b></label>&nbsp;&nbsp;
                <input type="text" id="name" name="name"></input><br></br><br></br>
                {error.errors?.name && error.errors?.name.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Address</b></label>&nbsp;&nbsp;
                <select id="address" name="address" defaultValue={""}>
                    <option disabled value={""}></option>
                    {addresses.map((address) => <option value={address} key={address}>{address}</option>)}
                </select><br></br><br></br>
                {error.errors?.address && error.errors?.address.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Description</b></label>&nbsp;&nbsp;
                <textarea id="description" name="description" rows={5} cols={50}></textarea><br></br><br></br>
                {error.errors?.description && error.errors?.description.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Phone</b></label>&nbsp;&nbsp;
                <input type="number" id="phone" name="phone"></input><br></br><br></br>
                {error.errors?.phone && error.errors?.phone.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Specialty</b></label>&nbsp;&nbsp;
                <select id="specialty" name="specialty" defaultValue={""}>
                    <option disabled value={""}></option>
                    {specialties.map((specialty) => <option value={specialty} key={specialty}>{specialty}</option>)}
                </select><br></br><br></br>
                {error.errors?.specialty && error.errors?.specialty.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                <label><b>Billing</b></label>&nbsp;&nbsp;
                <select id="billing" name="billing" defaultValue={""}>
                    <option disabled value={""}></option>
                    {billings.map((billing) => <option value={billing} key={billing}>{billing}</option>)}
                </select><br></br><br></br>
                {error.errors?.billing && error.errors?.billing.map((err) => (
                    <p key={err} className={styles.errorMessage}>{err}</p>
                ))}
                {(isPending || error.message !== null || (error.message === null && editCounter == 0)) ? <button disabled>Create</button> :
                <button type='submit' id='create_practice_button' name='create_practice_button' value={"Create"}>Create</button>}<br></br>
                <p className={styles.errorMessage}>{error.message}</p>
            </form></> : <h2>Practice successfully created</h2>}
        </div>
    )
}