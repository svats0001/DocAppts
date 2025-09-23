'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import "./globals.css";
import { handleLogout } from "./lib/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TopBar() {
    const [loggedIn, setLoggedIn] = useState<null | boolean>(null);
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const sessionId = document.cookie.match("(^|;)\\s*" + "sessionId" + "\\s*=\\s*([^;]+)");
        if (sessionId && sessionId.pop() !== "") {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      }
      setShowDropdown(false);}, []);

      function logout() {
        handleLogout().then((val) => {
          console.log(val);
          router.push("/")});
      }

      function toggleDropdown() {
        setShowDropdown(!showDropdown);
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
        {loggedIn == null ? <></> : !loggedIn ? 
        <li className="login-link"><Link href="/login">
        <b>Login/Register</b>
        </Link></li> : !showDropdown ? <div className="dropdown">
        <Image src="/profile_image.jpg" height={60} width={100} alt={"Welcome"} className="dropbtn" onClick={() => toggleDropdown()}></Image>
        </div> : <div className="dropdown"> 
        <Image src="/profile_image.jpg" height={60} width={100} alt={"Welcome"} className="dropbtn" onClick={() => toggleDropdown()}></Image>
        <div className="dropdown-content">
        <li><b><Link href="/user/appointments">Appointments</Link></b></li>
        <li><b><Link href="/user/profile">Profile</Link></b></li>
        <li><b><Link href="#" onClick={() => logout()}>Logout</Link></b></li></div></div>}
        </ul>
        </div>
    )
}