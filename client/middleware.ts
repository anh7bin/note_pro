import { ROUTES } from '@/lib/routes';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const isLoginPage = req.nextUrl.pathname === ROUTES.LOGIN;
        const token = req.nextauth.token;
        const hasValidSession = !!token?.token && !token.error;

        if (hasValidSession && isLoginPage) {
            return NextResponse.redirect(new URL(ROUTES.HOME, req.url));
        }

        if (!hasValidSession && !isLoginPage) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const isLoginPage = req.nextUrl.pathname === ROUTES.LOGIN;
                return (!!token?.token && !token.error) || isLoginPage;
            },
        },
        pages: {
            signIn: ROUTES.LOGIN,
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images and other static assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)',
    ],
};
