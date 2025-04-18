import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })

    const isAuthenticated = !!token
    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")

    if (isAuthPage) {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url))
      }
      return NextResponse.next()
    }

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error, allow the request to continue
    // This prevents authentication errors from blocking the entire site
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/", "/login", "/signup"],
}
