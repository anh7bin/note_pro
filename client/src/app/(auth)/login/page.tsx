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
import { useI18n } from '@/contexts/I18nContext';
import { LanguageMenu } from '@/components/ui/language-switcher';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const {
        workspaceSlug,
        loading: workspaceLoading,
        error: workspaceError,
    } = useWorkspace();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useI18n();
    const hasValidSession =
        status === AUTHENTICATED && !!session?.token && !session.error;
    const hasWorkspaceError =
        hasValidSession &&
        !workspaceLoading &&
        (!!workspaceError || !workspaceSlug);
    const errorMessage =
        status === AUTHENTICATED && !hasValidSession
            ? t('secureSessionError')
            : hasWorkspaceError
              ? t('workspaceLoadError')
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
            aria-label={t('loading')}>
            <PageLoading />
        </div>
    ) : (
        <main className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
            <div className="absolute right-4 top-4">
                <LanguageMenu />
            </div>
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
                        {t('welcome')}
                    </CardTitle>
                    {errorMessage ? (
                        <CardDescription
                            role="alert"
                            className="max-w-xs leading-relaxed text-destructive">
                            {errorMessage}
                        </CardDescription>
                    ) : (
                        <CardDescription className="max-w-xs leading-relaxed">
                            {t('signInDescription')}
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
                            <ButtonLoading>{t('signingIn')}</ButtonLoading>
                        ) : (
                            <>
                                <FcGoogle size={20} />
                                {errorMessage
                                    ? t('tryGoogleAgain')
                                    : t('continueWithGoogle')}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
