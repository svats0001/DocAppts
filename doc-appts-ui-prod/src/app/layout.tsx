import { Metadata } from "next";
import React from "react";

export const metadata : Metadata = {
  title: 'DocAppts',
  icons: {
    icon: '/docappts.png'
  }
}

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <>
        <html>
            <body>
                {children}
        </body>
        </html>
        </>
    )
}