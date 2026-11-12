import { NextResponse } from "next/server"

export function proxy(request){
    if(!request.cookies.get("token-pfs2")){
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

export const config = {
    matcher: ["/admin/:path*","/locatario/:path*"]
}