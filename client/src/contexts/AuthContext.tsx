'use client';

import { createContext, useContext } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { getUserIdFromToken } from '@/lib/utils';

interface AuthContextType {
    userId: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const token = session?.token ?? null;
    const userId = token ? getUserIdFromToken(token) : null;

    const value: AuthContextType = {
        userId,
        isLoading: status === 'loading',
        isAuthenticated:
            status === 'authenticated' && !session?.error && !!userId,
        token,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
    );
}
