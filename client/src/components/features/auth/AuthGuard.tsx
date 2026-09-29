'use client';

import { PageLoading } from '@/components/ui/loading';
import { AUTHENTICATED } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const { data: session, status } = useSession();

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
