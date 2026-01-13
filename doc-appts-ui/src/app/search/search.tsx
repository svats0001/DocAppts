'use client';
export const dynamic = 'force-dynamic';

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from '@/app/search/home.module.css';
import Card from "./card";
import { useDebouncedCallback } from "use-debounce";
import { JSX, MouseEvent, Suspense, useEffect, useState } from "react";
import locationData from "@/app/data/melbournelocations.json";

export type Practice = {
    id?: number;
    name?: string;
    address?: string;
    phone?: string;
    description?: string;
    thumbnailPath?: string;
    practitioners?: Practitioner[];
    specialty?: string;
    billing?: string;
    billingRate?: number;
}

export type Practitioner = {
    id?: number;
    firstName?: string;
    lastName?: string;
    description?: string;
    email?: string;
    mobile?: string;
    dob?: Date;
    specialty?: string;
    photoPath?: string;
    gender?: string;
    appointments?: Appointment;
    billing?: boolean;
}

export type BookedAppointment = {
    id?: number;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
    userId?: number;
}

export type AvailableAppointment = {
    id?: number;
    date?: Date;
    startTime?: Date;
    endTime?: Date;
}

export type Appointment = {
    id?: number;
    practitionerId?: number;
    practiceId?: number;
    availableAppointmentsDTO?: AvailableAppointment[];
    bookedAppointmentsDTO?: BookedAppointment[];
}

export const specialties = ["General Practitioner", "Iron Infusions", "Gastroenterologist", "Neurologist", "Hematologist", "Endocrinologist"] as const;

export const billing = ["Bulk billed", "Mixed", "No bulk billing"];

export default function Search({practices, err}: {practices: Practice[], err: boolean}) {
    return (
    <Suspense>
        <SearchImpl practices={practices} err={err}></SearchImpl>
    </Suspense>
    )
}

function SearchImpl({practices, err}: {practices: Practice[], err: boolean}) {
    const practicesRef = practices;
    console.log("practices = " + practices);
    const searchParams = useSearchParams();
    const [showSpecialty, setShowSpecialty] = useState(false);
    const [showBilling, setShowBilling] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string>(searchParams?.get('location')?.toString() ?? '');
    const params = searchParams ? new URLSearchParams(searchParams) : new URLSearchParams();
    const [locationVals, setLocationVals] = useState<string[]>(locationData.locations);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const pathName = usePathname();
    const showFilters = pathName?.split('/')[1].substring(0, 6) === 'search' ? true : false;
    const router = useRouter();
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(searchParams?.get('specialty')?.toString().split(';') ?? []);
    const [selectedBilling, setSelectedBilling] = useState<string[]>(searchParams?.get('billing')?.toString().split(';') ?? []);
    let pageNumber = 1;
    const practicesPerPage = 2;
    const [displayedPractices, setDisplayedPractices] = useState<[Practice, string][]>([]);
    const [numPages, setNumPages] = useState(0);
    const [pageLinks, setPageLinks] = useState<JSX.Element[]>([]);
    
    useEffect(() => {
        const loadPage = () => searchParams?.get('page') ? handlePageLinkClick(parseInt(searchParams?.get('page') ?? '1')) : null;
        /*const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key='+process.env.NEXT_PUBLIC_MAPS_API_KEY+'&libraries=routes';
        script.async = true; 
        script.onload = () => {*/
          loadPage();
        /*};
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };*/
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function alterPageLinks(numberOfPages: number) {
        const arr = [];
        console.log("numPages " + numPages);
        for (let i = 0; i < numberOfPages; i++) {
            console.log("Inside for loop");
        arr.push(
            <button className={styles.pageLinkButton} key={i} onClick={() => handlePageLinkClick(i+1)}>{i+1}</button>
        )
        }
        console.log(arr);
        console.log(pageLinks);
        setPageLinks(arr);
    }

    const handleSearch = useDebouncedCallback((term: string) => {
        pageNumber = 1;
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        handlePage(1, params);
    }, 200);

    function handlePageLinkClick(pageNo: number) {
        if (searchParams?.get('query')) {
            params.set('query', searchParams?.get('query') || '');
        }
        if (searchParams?.get('specialty')) {
            params.set('specialty', searchParams?.get('specialty') || '');
        }
        if (searchParams?.get('billing')) {
            params.set('billing', searchParams?.get('billing') || '');
        }
        if (searchParams?.get('location')) {
            params.set('location', searchParams?.get('location') || '');
        }
        handlePage(pageNo, params);
    }

    async function handlePage(pageNum: number, params: URLSearchParams) {
        let tmpDisplayedPractices : [Practice, string][] = [];
        pageNumber = pageNum;
        const query = params?.get('query');
        params.set('page', pageNumber.toString());
        let filterMap = new Map();
        if (selectedSpecialties.length > 0) {
            filterMap.set('specialty', selectedSpecialties);
        }
        if (selectedBilling.length > 0) {
            filterMap.set('billing', selectedBilling);
        }
        const location: string[] = params.get('location')?.toString().split(' ') ?? [];
        const postcode = location.length > 0 ? location[location.length-1] : undefined;

        if (query && (filterMap.size > 0)) {
            practices.forEach((practice) => {
                let addToList = true;
                if (filterMap.get('specialty')) {
                    const tmpPractice = practice.specialty?.replace('_', " ").toLowerCase();
                    for (let i = 0; i < selectedSpecialties.length; i++) {
                    if (practice.name?.toLowerCase().includes(query.toString().toLowerCase()) && (tmpPractice === selectedSpecialties[i].toLowerCase())) {
                        break;
                    }
                    if (i == (selectedSpecialties.length-1)) { addToList = false };
                    }
                } if (filterMap.get('billing')) {
                    const tmpBilling = practice.billing?.replace('_', " ").toLowerCase();
                    for (let i = 0; i < selectedBilling.length; i++) {
                        if (practice.name?.toLowerCase().includes(query.toString().toLowerCase()) && (tmpBilling === selectedBilling[i].toLowerCase())) {
                            break;
                        }
                        if (i == (selectedBilling.length-1)) { addToList = false };
                    }
                } if (addToList) {
                    tmpDisplayedPractices.push([practice, "None"]);
                }
            });
            console.log('Inside 1');
        }
        else if (query) {
            practices.forEach((practice) => {
                if (practice.name?.toLowerCase().includes(query.toString().toLowerCase())) {
                    tmpDisplayedPractices.push([practice, "None"]);
                }
            });
            console.log('Inside 2');
        } else if (filterMap.size > 0) {
            practices.forEach((practice) => {
                let addToList = true;
                if (filterMap.get('specialty')) {
                    const tmpPractice = practice.specialty?.replace('_', " ").toLowerCase();
                    for (let i = 0; i < selectedSpecialties.length; i++) {
                    if (tmpPractice === selectedSpecialties[i].toLowerCase()) {
                        break;
                    }
                    if (i == (selectedSpecialties.length-1)) { addToList = false };
                    }
                } if (filterMap.get('billing')) {
                    const tmpBilling = practice.billing?.replace('_', " ").toLowerCase();
                    for (let i = 0; i < selectedBilling.length; i++) {
                        if (tmpBilling === selectedBilling[i].toLowerCase()) {
                            break;
                        }
                        if (i == (selectedBilling.length-1)) { addToList = false };
                    }
                } if (addToList) {
                    tmpDisplayedPractices.push([practice, "None"]);
                }
            });
            console.log('Inside 3');
        } else {
            console.log(practices);
            for (let i = 0; i < practices.length; i++) {
                tmpDisplayedPractices.push([practices[i], "None"]);
            }
        }
        const sortedTmpDisplayedPractices: [Practice, string][] = [];
        if (postcode && tmpDisplayedPractices.length > 0) {
            console.log(postcode);
        const service: google.maps.DistanceMatrixService = new window.google.maps.DistanceMatrixService();
        let destinations: string[] = [];
        for (let i = 0; i < tmpDisplayedPractices.length; i++) {
            destinations.push(tmpDisplayedPractices[i][0].address || '');
        }
        await service.getDistanceMatrix({
            origins: [postcode],
            destinations: destinations,
            travelMode: window.google.maps.TravelMode.DRIVING
        }, (response: google.maps.DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
            console.log("Inside response");
            console.log(status);
            console.log(response);
            if (status === 'OK') {
            type valData = [string, number, string];
            const vals: valData[] = [];
            const origins = response?.originAddresses || [];
            destinations = response?.destinationAddresses || [];
            for (let i = 0; i < origins?.length; i++) {
                const results = response?.rows[i].elements || [];
                for (let j = 0; j < results?.length; j++) {
                    vals.push([destinations[j], results[j].distance.value, results[j].distance.text]);
                }
            }
            vals.sort((a,b) => {
                return a[1]-b[1];
            })
            console.log(tmpDisplayedPractices);
            for (let k = 0; k < vals.length; k++) {
                for (let l = 0; l < tmpDisplayedPractices.length; l++) {
                    let tmpAddressPostcode = vals[k][0].split(',')[0];
                    tmpAddressPostcode = tmpAddressPostcode.substring(tmpAddressPostcode.length-4, tmpAddressPostcode.length);
                    if (tmpAddressPostcode === tmpDisplayedPractices[l][0].address?.split(' ')[0]) {
                        tmpDisplayedPractices[l][1] = vals[k][2];
                        sortedTmpDisplayedPractices.push(tmpDisplayedPractices[l]);
                        break;
                    }
                }
            }
            tmpDisplayedPractices = sortedTmpDisplayedPractices;
        }
        })
        }
        const numberOfPages = Math.ceil(tmpDisplayedPractices.length/practicesPerPage)
        setNumPages(numberOfPages);
        try {
            tmpDisplayedPractices = tmpDisplayedPractices.slice((pageNum*practicesPerPage)-practicesPerPage, pageNum*practicesPerPage);
        } catch (exc) {
            console.log(exc);
            tmpDisplayedPractices = tmpDisplayedPractices.slice((pageNum*practicesPerPage)-practicesPerPage, displayedPractices.length);
        }
        setDisplayedPractices(tmpDisplayedPractices);
        alterPageLinks(numberOfPages);
        window.history.pushState({}, '', '/search?'+params.toString());
    }

    function changeSelectedSpecialty(specialty: string) {
        let arr = [...selectedSpecialties];
        for (let i = 0; i < selectedSpecialties.length; i++) {
            if (selectedSpecialties[i] === specialty) {
                if (i != (selectedSpecialties.length-1)) {
                    arr = selectedSpecialties.slice(0, i).concat(selectedSpecialties.slice(i+1, selectedSpecialties.length));
                } else {
                    arr = selectedSpecialties.slice(0, i);
                }
                setSelectedSpecialties(arr);
                return;
            }
        }
        arr.push(specialty);
        console.log(arr);
        setSelectedSpecialties(arr);
    }

    function submitFilter() {
        console.log(selectedSpecialties);
        if (searchParams?.get('query')) {
            params.set('query', searchParams?.get('query') || '');
        }
        if (selectedSpecialties.length > 0) {
            let filterString = '';
            for (let i = 0; i < selectedSpecialties.length; i++) {
                filterString = filterString + selectedSpecialties[i] + ';'
            }
            params.set('specialty', filterString);
        } else {
            params.delete('specialty');
        }
        if (selectedBilling.length > 0) {
            let filterString = '';
            for (let i = 0; i < selectedBilling.length; i++) {
                filterString = filterString + selectedBilling[i] + ';'
            }
            params.set('billing', filterString);
        } else {
            params.delete('billing');
        }
        handlePage(1, params);
    }

    function toggleSpecialtyDropdown() {
        setShowSpecialty(!showSpecialty);
    }

    function searchButtonHandler() {
        if (searchParams?.get('query')) {
            if (params.get('location')) {
                router.push("/search?query="+searchParams.get('query')?.toString()+"&location="+params.get('location')?.toString()+"&page=1");
            } else { router.push("/search?query="+searchParams.get('query')?.toString()+"&page=1");
            }
        } if (selectedLocation !== '') {
            router.push("/search?location="+selectedLocation+"&page=1");
        }
        else {router.push("/search?page=1");}
    }

    function handleLocationSearch(val: string) {
        setSelectedLocation(val);
        if (val.toLowerCase() !== params.get('location')?.toString().toLowerCase()) {
            params.delete('location');
        }
        const newLocationVals: string[] = [];
        locationData.locations.map((locationVal) => {
            if (locationVal.includes(val.toUpperCase())) {
                newLocationVals.push(locationVal);
            }
        });
        console.log("Inside location search");
        console.log(params.get('location'));
        setLocationVals(newLocationVals);
    }

    function handleLocationDropdownClick(val: string) {
        console.log("Inside dropdown click");
        console.log(val);
        params.set('location', val);
        setSelectedLocation(val);
    }

    function handleLocationSearchClick(e: MouseEvent) {
        console.log("Inside search click");
        if (e.currentTarget.id === "postcodeInput") {
            setShowLocationDropdown(true);
            e.stopPropagation();
            return;
        }
        setShowLocationDropdown(false);
    }

    function changeSelectedBilling(billing: string) {
        let arr = [...selectedBilling];
        for (let i = 0; i < selectedBilling.length; i++) {
            if (selectedBilling[i] === billing) {
                if (i != (selectedBilling.length-1)) {
                    arr = selectedBilling.slice(0, i).concat(selectedBilling.slice(i+1, selectedBilling.length));
                } else {
                    arr = selectedBilling.slice(0, i);
                }
                setSelectedBilling(arr);
                return;
            }
        }
        arr.push(billing);
        setSelectedBilling(arr);
    }
    
    function toggleBillingDropdown() {
        setShowBilling(!showBilling);
    }

    return (
    <div onClick={(e) => handleLocationSearchClick(e)}>
        <div className={styles.alignment} >
        <h3>Search list of practices</h3><br></br>
        <input className={styles.input} type="text" placeholder="Enter practice name" onChange={(e) => {
            handleSearch(e.target.value)
        }} defaultValue={searchParams?.get('query')?.toString()}></input>&nbsp;
        <input type="text" className={styles.locationSearch} placeholder="Enter suburb or postcode" onChange={(e) => {
            handleLocationSearch(e.target.value)
        }} onClick={(e) => handleLocationSearchClick(e)} value={selectedLocation} id="postcodeInput"></input>&nbsp;
        <button className={styles.searchButton} onClick={() => searchButtonHandler()}>Search</button>
        {showLocationDropdown ? <div className={styles.locationDropdown}>
            {locationVals.map((val) => (
                <p onClick={() => handleLocationDropdownClick(val)} key={val}>{val}</p>
            ))}
        </div> : null}
        </div><br></br>
        <div>
        {showFilters ? <div className={styles.filterContainer}><div className={styles.specialtyDiv}>
        <b onClick={() => toggleSpecialtyDropdown()} className={styles.specialtyText}>Specialty</b>&nbsp;
        {showSpecialty ? <div className={styles.specialtyDropdown}><br></br>
        {specialties.map((specialty) => (
                <p key={specialty}>
                <input type="checkbox" defaultChecked={selectedSpecialties.includes(specialty) ? true : false} onClick={() => changeSelectedSpecialty(specialty)}></input> {specialty}
                </p>
            ))}<br></br>
        <button onClick={() => submitFilter()}>Save</button>
        </div> : null}
        </div>&nbsp;<div className={styles.billingDiv}>
        <b onClick={() => toggleBillingDropdown()} className={styles.specialtyText}>Billing</b>&nbsp;
        {showBilling ? <div className={styles.specialtyDropdown}><br></br>
        {billing.map((billing) => (
            <p key={billing}>
                <input type="checkbox" defaultChecked={selectedBilling.includes(billing) ? true : false} onClick={() => changeSelectedBilling(billing)}></input> {billing}
            </p>
        ))}<br></br>
        <button onClick={() => submitFilter()}>Save</button>
        </div> : null}</div><br></br></div> : null}
        {displayedPractices.length > 0 ?
        <ul>
             {displayedPractices.map(([practice, distance]) => (
                <li key={practice.id}><Link href={"/practice/"+practice.name+"---"+practice.phone}><Card practice={practice} distance={distance}></Card></Link></li>
            ))}
        </ul> : null}
        {err ? <p>Unable to fetch data</p> : null}<br></br>
        <div className={styles.pageLinks}>
            {pageLinks}
        </div>
        </div>
    </div>
    );
}