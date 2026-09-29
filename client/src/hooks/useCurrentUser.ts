'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useAuth } from './useAuth';

export interface CurrentUser {
    id: string | null;
    name: string | null;
    email: string | null;
    image: string | null;
}

export function useCurrentUser(): CurrentUser {
    const { userId } = useAuth();
    const { data: session } = useSession();

    return useMemo(
        () => ({
            id: userId ?? null,
            name: session?.user?.name ?? null,
            email: session?.user?.email ?? null,
            image: session?.user?.image ?? null,
        }),
        [
            session?.user?.email,
            session?.user?.image,
            session?.user?.name,
            userId,
        ]
    );
}
