import { ReactNode } from "react";
import Footer from './footer';
import './globals.css';
import TopBar from './topbar';

export default function TemplateWrapper({children} : {children: ReactNode}) {
    return (
        <div className='container'>
            <TopBar></TopBar>
            <br></br>
            <div className='mainContent'>
            <br></br>
            {children}
            </div>
            <Footer></Footer>
        </div>
    )
}