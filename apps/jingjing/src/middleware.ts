

export { default } from "next-auth/middleware";
export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/user/:path*', '/api/auth/:path*'],
}

