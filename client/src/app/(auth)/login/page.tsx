'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ButtonLoading, PageLoading } from '@/components/ui/loading';
import { AUTHENTICATED } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useWorkspace } from '@/hooks/useWorkspace';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const {
        workspaceSlug,
        loading: workspaceLoading,
        error: workspaceError,
    } = useWorkspace();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const hasValidSession =
        status === AUTHENTICATED && !!session?.token && !session.error;
    const hasWorkspaceError =
        hasValidSession &&
        !workspaceLoading &&
        (!!workspaceError || !workspaceSlug);
    const errorMessage =
        status === AUTHENTICATED && !hasValidSession
            ? 'Google sign-in succeeded, but the app could not create a secure session. Please try again.'
            : hasWorkspaceError
              ? 'Your session is ready, but your workspace could not be loaded. Please try signing in again.'
              : null;

    useEffect(() => {
        if (hasValidSession && workspaceSlug && !workspaceLoading) {
            router.replace(ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug));
        }
    }, [hasValidSession, workspaceSlug, workspaceLoading, router]);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            setIsLoading(true);

            if (status === AUTHENTICATED) {
                await signOut({ redirect: false });
            }

            await signIn('google', { callbackUrl: ROUTES.HOME });
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    return status === 'loading' || (hasValidSession && !hasWorkspaceError) ? (
        <div
            className="flex min-h-dvh items-center justify-center"
            role="status"
            aria-label="Loading">
            <PageLoading />
        </div>
    ) : (
        <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
            <Card className="w-full max-w-sm border-border-subtle bg-card shadow-md">
                <CardHeader className="items-center space-y-3 p-6 pb-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
                        <Image
                            src="/images/logo.png"
                            alt=""
                            width={40}
                            height={40}
                            priority
                        />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                        Welcome to Bin Craft
                    </CardTitle>
                    {errorMessage ? (
                        <CardDescription
                            role="alert"
                            className="max-w-xs leading-relaxed text-destructive">
                            {errorMessage}
                        </CardDescription>
                    ) : (
                        <CardDescription className="max-w-xs leading-relaxed">
                            Sign in to continue to your notes, tasks, and shared
                            work.
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent className="p-6 pt-2">
                    <Button
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full">
                        {isLoading ? (
                            <ButtonLoading>Signing in...</ButtonLoading>
                        ) : (
                            <>
                                <FcGoogle size={20} />
                                {errorMessage
                                    ? 'Try Google again'
                                    : 'Continue with Google'}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
