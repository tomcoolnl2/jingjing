import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/user/:path*',
        '/api/auth/:path*',
        '/api/admin/:path*',
        '/api/user/:path*',
    ],
};

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.pathname;
        const userRole = req.nextauth.token?.role;
        const isAdmin = userRole === 'admin';

        if (url?.includes('/admin') && !isAdmin) {
            return NextResponse.redirect(new URL('/', req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token;
            },
        },
    },
);
