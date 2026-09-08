'use client';

import { ROUTES } from '@/lib/routes';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AUTHENTICATED } from '@/lib/constants';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ButtonLoading, PageLoading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';

export default function Home() {
    const { data: session, status } = useSession();
    const { workspaceSlug, loading, error, refetch } = useWorkspace();
    const router = useRouter();
    const [isRetrying, setIsRetrying] = useState(false);
    const hasValidSession =
        status === AUTHENTICATED && !!session?.token && !session.error;

    useEffect(() => {
        if (status === 'loading' || loading) return;

        if (!hasValidSession) {
            router.replace(ROUTES.LOGIN);
            return;
        }

        if (workspaceSlug) {
            router.replace(ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug));
        }
    }, [status, hasValidSession, workspaceSlug, loading, router]);

    const handleRetry = useCallback(async () => {
        setIsRetrying(true);
        try {
            await refetch();
        } catch (refetchError) {
            console.error('Workspace retry error:', refetchError);
        } finally {
            setIsRetrying(false);
        }
    }, [refetch]);

    const handleSignOut = useCallback(() => {
        void signOut({ callbackUrl: ROUTES.LOGIN });
    }, []);

    if (status === 'loading' || loading || !hasValidSession || workspaceSlug) {
        return <PageLoading />;
    }

    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
            <Card role="alert" className="w-full max-w-md text-center">
                <CardHeader className="items-center space-y-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <CircleAlert className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <CardTitle>Workspace unavailable</CardTitle>
                    <CardDescription className="max-w-sm leading-relaxed">
                        {error
                            ? 'We could not connect to your workspace. Check the service configuration and try again.'
                            : 'No workspace was found for this account. Try again or sign in once more to finish setup.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={handleSignOut}>
                        Sign out
                    </Button>
                    <Button onClick={handleRetry} disabled={isRetrying}>
                        {isRetrying ? (
                            <ButtonLoading>Trying again...</ButtonLoading>
                        ) : (
                            'Try again'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
