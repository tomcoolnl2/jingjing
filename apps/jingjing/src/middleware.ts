import withAuth from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
    matcher: ['/dashboard/:path*', '/api/user/:path*'],
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
        const isAdmin = token.user?.role === 'admin';

        if (url.includes('/admin') && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); // TODO
        }

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
