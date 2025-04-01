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

interface UserToken {
    user?: {
        role?: string;
    };
}

export default withAuth(
    async function middleware(req) {
        const url = req.nextUrl.pathname;

        const token = req.nextauth.token as UserToken;
        const userRole = token.user?.role;
        const isAdmin = userRole === 'admin';

        if (url?.includes('/admin') && !isAdmin) {
            return NextResponse.redirect(new URL('/', req.url));
        }

        // Default response if no conditions are met
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token;
            },
        },
    },
);
