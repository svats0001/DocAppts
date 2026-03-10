import Link from "next/link";
import "./globals.css";

export default function Footer() {
    return (
        <div className="footer">
            <div className="footerLinks">
            <Link href="/login/practice"><b>Practices login</b></Link>
            </div><br></br>
            <h3>DocAppts 2025</h3>
        </div>
    )
}