import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
    return (
        <Html>
            <Head></Head>
            <body>
                <Main></Main>
                <NextScript></NextScript>
                <Script src={"https://maps.googleapis.com/maps/api/js?key="+process.env.NEXT_PUBLIC_MAPS_API_KEY+"&libraries=routes"} strategy="beforeInteractive"></Script>
            </body>
        </Html>
    )
}