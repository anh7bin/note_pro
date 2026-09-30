'use client';

import AuthWrapper from '@/components/features/auth/AuthWrapper';
import MainLayout from '@/components/layouts/main-layout/MainLayout';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { ApolloClientProvider } from '@/contexts/ApolloClientProvider';
import { NextAuthProvider } from '@/contexts/AuthContext';
import { DocumentAccessProvider } from '@/contexts/DocumentAccessContext';
import { DocumentSelectionProvider } from '@/contexts/DocumentSelectionContext';
import { I18nProvider } from '@/contexts/I18nContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { ToastProvider } from '@/contexts/ToastProvider';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { Locale } from '@/i18n/config';

export default function Providers({
    children,
    initialLocale,
}: {
    children: React.ReactNode;
    initialLocale: Locale;
}) {
    return (
        <I18nProvider initialLocale={initialLocale}>
            <ErrorBoundary>
                <ApolloClientProvider>
                    <NextAuthProvider>
                        <WorkspaceProvider>
                            <ThemeProvider>
                                <ToastProvider>
                                    <LoadingProvider>
                                        <DocumentAccessProvider>
                                            <DocumentSelectionProvider>
                                                <AuthWrapper>
                                                    <MainLayout>
                                                        {children}
                                                    </MainLayout>
                                                </AuthWrapper>
                                            </DocumentSelectionProvider>
                                        </DocumentAccessProvider>
                                    </LoadingProvider>
                                </ToastProvider>
                            </ThemeProvider>
                        </WorkspaceProvider>
                    </NextAuthProvider>
                </ApolloClientProvider>
            </ErrorBoundary>
        </I18nProvider>
    );
}
