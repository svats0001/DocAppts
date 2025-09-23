'use client';

import { useState } from "react";

export default function SubmitBook(props: {submitFn: () => void}) {
    const [toggleButton, setToggleButton] = useState(false);

    function switchToggleButton() {
        setToggleButton(!toggleButton);
    }

    return (<>
        {toggleButton ? <>
        <button disabled>Book appointment</button></> : <>
        <button onClick={() => {switchToggleButton(); props.submitFn()}}>Book appointment</button></>}</>
    )
}