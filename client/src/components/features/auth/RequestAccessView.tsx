'use client';

import { Clock3, LockKeyhole, LogOut, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccessRequestStatus } from '@/types/types';
import { Loading } from '@/components/ui/loading';
import { useRequestAccess } from './hooks/useRequestAccess';

interface RequestAccessViewProps {
    documentId: string;
}

export function RequestAccessView({ documentId }: RequestAccessViewProps) {
    const {
        requestStatus,
        isLoading,
        isRequesting,
        userEmail,
        logout,
        isLoggingOut,
        requestReadAccess,
    } = useRequestAccess(documentId);

    return isLoading ? (
        <div className="flex h-full min-h-40 items-center justify-center">
            <Loading text="Checking access…" />
        </div>
    ) : (
        <div className="flex h-full min-h-0 items-center justify-center overflow-y-auto bg-background p-4">
            <div className="w-full max-w-md space-y-6 rounded-lg border border-border-subtle bg-card p-6 text-center shadow-sm sm:p-8">
                <div className="flex justify-center">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full ${
                            requestStatus === AccessRequestStatus.PENDING
                                ? 'bg-warning-subtle text-warning-foreground'
                                : requestStatus === AccessRequestStatus.REJECTED
                                  ? 'bg-destructive/10 text-destructive'
                                  : 'bg-muted text-muted-foreground'
                        }`}>
                        {requestStatus === AccessRequestStatus.PENDING ? (
                            <Clock3 className="h-7 w-7" />
                        ) : requestStatus === AccessRequestStatus.REJECTED ? (
                            <XCircle className="h-7 w-7" />
                        ) : (
                            <LockKeyhole className="h-7 w-7" />
                        )}
                    </div>
                </div>

                <h1 className="text-xl font-medium text-foreground">
                    {requestStatus === AccessRequestStatus.PENDING
                        ? 'Access request pending'
                        : requestStatus === AccessRequestStatus.REJECTED
                          ? 'Access request denied'
                          : 'Request access to this document'}
                </h1>

                <p className="text-muted-foreground">
                    {requestStatus === AccessRequestStatus.PENDING
                        ? "Your request is waiting for approval. You'll be notified once it's reviewed."
                        : requestStatus === AccessRequestStatus.REJECTED
                          ? 'Your access request was denied by the document owner.'
                          : 'You can view this document once your request is approved.'}
                </p>

                {!requestStatus && (
                    <Button
                        variant="default"
                        className="w-full"
                        onClick={requestReadAccess}
                        disabled={isRequesting}
                        aria-busy={isRequesting}>
                        <LockKeyhole />
                        {isRequesting ? 'Sending request…' : 'Request access'}
                    </Button>
                )}

                {requestStatus === AccessRequestStatus.PENDING && (
                    <div className="rounded-md border border-warning/20 bg-warning-subtle p-4">
                        <div className="flex items-center gap-2 text-warning-foreground">
                            <Clock3 className="h-5 w-5" />
                            <p className="text-sm font-medium">
                                Waiting for approval…
                            </p>
                        </div>
                    </div>
                )}

                {requestStatus === AccessRequestStatus.REJECTED && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                        <div className="flex items-center gap-2 text-destructive">
                            <XCircle className="h-5 w-5" />
                            <p className="text-sm font-medium">
                                Request was denied
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                        You are logged in as{' '}
                        <span className="font-medium">{userEmail}</span>
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={logout}
                        disabled={isLoggingOut}
                        aria-busy={isLoggingOut}>
                        <LogOut />
                        {isLoggingOut ? 'Signing out…' : 'Sign out'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
