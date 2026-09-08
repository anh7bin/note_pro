'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/routes';
import { AUTHENTICATED } from '@/lib/constants';
import { PageLoading } from '@/components/ui/loading';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const hasValidSession =
        status === AUTHENTICATED && !!session?.token && !session.error;

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (!hasValidSession) {
            router.replace(ROUTES.LOGIN);
        }
    }, [status, hasValidSession, router]);

    return status === 'loading' || !hasValidSession ? (
        <PageLoading />
    ) : (
        <>{children}</>
    );
}
