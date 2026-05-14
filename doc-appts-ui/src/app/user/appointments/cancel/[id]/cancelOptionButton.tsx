'use client';

import { useState } from "react";

export default function CancelOptionButton(props: {yesFnAction: () => Promise<void>, noFnAction: () => Promise<void>}) {
    const [toggleButton, setToggleButton] = useState(false);

    function switchToggleButton() {
        setToggleButton(!toggleButton);
    }

    return (
        <div>
            {toggleButton ? <>
            <button disabled>Yes</button>&nbsp;
            <button disabled>No</button></> : <>
            <button onClick={() => {switchToggleButton(); props.yesFnAction()}}>Yes</button>&nbsp;
            <button onClick={() => {switchToggleButton(); props.noFnAction()}}>No</button></>}
        </div>
    )
}