'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetErrorBoundary,
}) => {
    return (
        <div className="flex min-h-dvh items-center justify-center bg-background p-4">
            <div
                role="alert"
                className="w-full max-w-lg space-y-4 rounded-lg border border-border-subtle bg-card p-6 text-center shadow-sm sm:p-8">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <CircleAlert className="h-6 w-6" aria-hidden="true" />
                </span>
                <h1 className="text-xl font-semibold text-foreground">
                    Something went wrong
                </h1>
                <p className="text-muted-foreground">
                    An unexpected error occurred. Please try refreshing the
                    page.
                </p>
                <div className="flex flex-col-reverse justify-center gap-2 sm:flex-row">
                    <Button onClick={resetErrorBoundary} variant="outline">
                        Try again
                    </Button>
                    <Button onClick={() => window.location.reload()}>
                        Refresh page
                    </Button>
                </div>
                {process.env.NODE_ENV === 'development' && error && (
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer text-sm text-muted-foreground">
                            Error details (development only)
                        </summary>
                        <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-muted p-4 text-xs">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<ErrorFallbackProps>;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
    children,
    fallback,
}) => {
    const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    };

    return (
        <ReactErrorBoundary
            FallbackComponent={fallback || ErrorFallback}
            onError={handleError}
            onReset={() => {
                // Reset the state of your app here
                // For example, you might want to reset some state or navigate to a different page
            }}>
            {children}
        </ReactErrorBoundary>
    );
};

export default ErrorBoundary;
