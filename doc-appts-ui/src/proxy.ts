import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {

    const nonce: string = crypto.randomUUID();

    request.headers.set('Content-Security-Policy', "script-src 'nonce-" + nonce + "';");
    
    const isServerAction =
      request.headers.has("next-action") || request.headers.has("x-action");

    if (isServerAction) {
      return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    }

    let sessionId = request.cookies.get('sessionId');
    const isAuthenticated = sessionId ? (await pollSession(sessionId.value)) === 'Session updated' : false;
    const pathName = request.nextUrl.pathname;

    if (!isAuthenticated && (pathName.startsWith('/login/success') || pathName.startsWith('/user')
        || pathName.includes('/appointment/') || pathName.includes('/booked/'))) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log("isAuthenticated=" + isAuthenticated);

    if (isAuthenticated && (pathName.startsWith('/login') || pathName.startsWith('/register'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
}

async function pollSession(sessionId: string) {
    const data = await fetch("https://localhost:7800/"+sessionId,
        {headers: {
            "X-API-KEY": process.env.X_API_KEY || "",
            "Content-Type": "application/json"
        }}
    );
    let res = await data.text();
    return res;
}