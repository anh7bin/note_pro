'use client';

import { Clock3, LockKeyhole, LogOut, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccessRequestStatus } from '@/types/types';
import { Loading } from '@/components/ui/loading';
import { useRequestAccess } from './hooks/useRequestAccess';
import { useI18n } from '@/contexts/I18nContext';

interface RequestAccessViewProps {
    documentId: string;
}

export function RequestAccessView({ documentId }: RequestAccessViewProps) {
    const { t } = useI18n();
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
            <Loading text={t('checkingAccess')} />
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
                            <Clock3 />
                        ) : requestStatus === AccessRequestStatus.REJECTED ? (
                            <XCircle />
                        ) : (
                            <LockKeyhole />
                        )}
                    </div>
                </div>

                <h1 className="text-xl font-medium text-foreground">
                    {requestStatus === AccessRequestStatus.PENDING
                        ? t('accessRequestPending')
                        : requestStatus === AccessRequestStatus.REJECTED
                          ? t('accessRequestDenied')
                          : t('requestDocumentAccess')}
                </h1>

                <p className="text-muted-foreground">
                    {requestStatus === AccessRequestStatus.PENDING
                        ? t('accessPendingDescription')
                        : requestStatus === AccessRequestStatus.REJECTED
                          ? t('accessDeniedDescription')
                          : t('accessRequestDescription')}
                </p>

                {!requestStatus && (
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={requestReadAccess}
                        disabled={isRequesting}>
                        <LockKeyhole />
                        {isRequesting
                            ? t('sendingRequest')
                            : t('requestAccess')}
                    </Button>
                )}

                {requestStatus === AccessRequestStatus.PENDING && (
                    <div className="rounded-md border border-warning/20 bg-warning-subtle p-4">
                        <div className="flex items-center gap-2 text-warning-foreground">
                            <Clock3 />
                            <p className="text-sm font-medium">
                                {t('waitingForApproval')}
                            </p>
                        </div>
                    </div>
                )}

                {requestStatus === AccessRequestStatus.REJECTED && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                        <div className="flex items-center gap-2 text-destructive">
                            <XCircle />
                            <p className="text-sm font-medium">
                                {t('requestWasDenied')}
                            </p>
                        </div>
                    </div>
                )}

                <div className="space-y-3 text-sm text-muted-foreground">
                    <p>{t('loggedInAs', { email: userEmail || '' })}</p>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={logout}
                        disabled={isLoggingOut}>
                        <LogOut />
                        {isLoggingOut ? t('signingOut') : t('signOut')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
