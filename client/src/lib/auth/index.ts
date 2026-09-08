import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

function isBackendTokenValid(token?: string): boolean {
    if (!token) return false;

    try {
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1] || '', 'base64url').toString()
        ) as { exp?: number };

        // Refresh one minute before expiry so an active WebSocket never starts
        // with a token that is about to become invalid.
        return Boolean(payload.exp && payload.exp * 1000 > Date.now() + 60_000);
    } catch {
        return false;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user, account }) {
            if ((account && user) || !isBackendTokenValid(token.token)) {
                try {
                    const email = user?.email || token.email;

                    if (!email) {
                        token.error = 'BackendAuthFailed';
                        return token;
                    }

                    const res = await axios.post(
                        `${process.env.BACKEND_URL}/auth/google`,
                        {
                            name: user?.name || token.name,
                            email,
                            avatar_url: user?.image || token.picture,
                        },
                        {
                            timeout: 30000, // 30 seconds timeout
                            headers: {
                                'x-internal-auth-secret':
                                    process.env.INTERNAL_AUTH_SECRET,
                            },
                        }
                    );

                    token.token = res.data.token;
                    delete token.error;
                } catch (error) {
                    console.error('Backend auth error:', error);
                    token.error = 'BackendAuthFailed';
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.token = token.token;
            if (token.error) {
                session.error = token.error;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    debug: true, // Enable debug mode
};
