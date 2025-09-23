'use client';

import { useState } from "react";

export default function CancelOptionButton(props: {yesFn: () => void, noFn: () => void}) {
    const [toggleButton, setToggleButton] = useState(false);

    function switchToggleButton() {
        setToggleButton(!toggleButton);
    }

    return (
        <div>
            {toggleButton ? <>
            <button disabled>Yes</button>&nbsp;
            <button disabled>No</button></> : <>
            <button onClick={() => {switchToggleButton(); props.yesFn()}}>Yes</button>&nbsp;
            <button onClick={() => {switchToggleButton(); props.noFn()}}>No</button></>}
        </div>
    )
}