'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";
import { handleLogout, handlePracticeLogout } from "./lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TopBar() {
    const [loggedIn, setLoggedIn] = useState<null | boolean>(null);
    const [practiceLoggedIn, setPracticeLoggedIn] = useState<null | boolean>(null);
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPracticeDropdown, setShowPracticeDropdown] = useState(false);
    console.log("Inside template");

    useEffect(() => {
      console.log("Inside top bar");
      if (typeof window !== "undefined") {
        const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        if (sessionId && sessionId.pop() !== "") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        };

        const practiceSessionId = document.cookie.match("(^|;)\\s*" + "practiceSessionId" + "\\s*=\\s*([^;]+)");
        if (practiceSessionId && practiceSessionId.pop() !== "") {
          setPracticeLoggedIn(true);
        } else {
          setPracticeLoggedIn(false);
        }

        const handleBeforeUnload = (event: Event) => {
          event.preventDefault();
          setShowDropdown(false);
          setShowPracticeDropdown(false);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        
      }});

      function logout() {
        handleLogout().then((val) => {
          console.log(val);
          router.push("/")});
      }

      function practiceLogout() {
        handlePracticeLogout().then((val) => {
          console.log(val);
          router.push("/")});
      }

      function toggleDropdown() {
        setShowDropdown(!showDropdown);
      }

      function togglePracticeDropdown() {
        setShowPracticeDropdown(!showPracticeDropdown);
      }

    return (
        <div>
        <ul className="navLinks">
        {/*<li>
          <Image src={"/docappts.png"} alt="DocAppts" height={33} width={33} id="company-image"></Image>
        </li>*/}
        <li><Link href="/" id="company-name">
        <b>DocAppts</b>
        </Link></li>
        {loggedIn == null ? <></> : !loggedIn ? practiceLoggedIn != null && practiceLoggedIn ? !showPracticeDropdown ?
        <><div className="dropdown"><Image src="/profile_image.jpg" height={60} width={100} alt={"Welcome"} className="dropbtn" onClick={() => togglePracticeDropdown()}></Image></div></> :
        <div className="dropdown"><Image src="/profile_image.jpg" height={60} width={100} alt={"Welcome"} className="dropbtn" onClick={() => togglePracticeDropdown()}></Image>
        <div className="dropdown-content">
          <li className="dashboardLink"><b><Link href="/practice/dashboard">Dashboard</Link></b></li>
          <li className="logoutLink"><b><Link href="#" onClick={() => practiceLogout()}>Logout</Link></b></li>
        </div></div> : <>
        <li className="login-link"><Link href="/login">
        <b>Login/Register</b>
        </Link></li>
        <li className="listPractice"><b><Link href="/register/practice">List your practice</Link></b></li></> : !showDropdown ? <div className="dropdown"><div className="profileImgWrapper">
        <Image src="/profile_image.jpg" fill style={{objectFit: 'cover'}}/*sizes="(max-width: 50px) 12.5vw, 50px"*/ alt={"Welcome"} className="dropbtn" onClick={() => toggleDropdown()}></Image></div>
        </div> : <div className="dropdown"><div className="profileImgWrapper">
        <Image src="/profile_image.jpg" fill style={{objectFit: 'cover'}}/*sizes="(max-width: 50px) 12.5vw, 50px"*/ alt={"Welcome"} className="dropbtn" onClick={() => toggleDropdown()}></Image></div>
        <div className="dropdown-content">
        <li><b><Link href="/user/appointments">Appointments</Link></b></li>
        <li><b><Link href="/user/card">Card</Link></b></li>
        <li><b><Link href="/user/profile">Profile</Link></b></li>
        <li><b><Link href="#" onClick={() => logout()}>Logout</Link></b></li></div></div>}
        </ul>
        </div>
    )
}