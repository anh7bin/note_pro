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

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <ApolloClientProvider>
                <NextAuthProvider>
                    <ThemeProvider>
                        <ToastProvider>
                            <LoadingProvider>
                                <DocumentAccessProvider>
                                    <DocumentSelectionProvider>
                                        <AuthWrapper>
                                            <MainLayout>{children}</MainLayout>
                                        </AuthWrapper>
                                    </DocumentSelectionProvider>
                                </DocumentAccessProvider>
                            </LoadingProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </NextAuthProvider>
            </ApolloClientProvider>
        </ErrorBoundary>
    );
}
