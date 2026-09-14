'use client';

import { ThemeProvider } from '@/contexts/ThemeProvider';
import MainLayout from '@/components/layouts/main-layout/MainLayout';
import AuthWrapper from '@/components/features/auth/AuthWrapper';
import { NextAuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastProvider';
import { ApolloClientProvider } from '@/contexts/ApolloClientProvider';
import { DocumentAccessProvider } from '@/contexts/DocumentAccessContext';
import { DocumentSelectionProvider } from '@/contexts/DocumentSelectionContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { I18nProvider } from '@/contexts/I18nContext';
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
                    </NextAuthProvider>
                </ApolloClientProvider>
            </ErrorBoundary>
        </I18nProvider>
    );
}
