'use client';

import { LogOut } from 'lucide-react';
import { FiLock, FiClock, FiXCircle } from 'react-icons/fi';
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
        <div className="flex items-center justify-center min-h-screen">
            <Loading />
        </div>
    ) : (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            requestStatus === AccessRequestStatus.PENDING
                                ? 'bg-yellow-100 dark:bg-yellow-900/20'
                                : requestStatus === AccessRequestStatus.REJECTED
                                  ? 'bg-red-100 dark:bg-red-900/20'
                                  : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                        {requestStatus === AccessRequestStatus.PENDING ? (
                            <FiClock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                        ) : requestStatus === AccessRequestStatus.REJECTED ? (
                            <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        ) : (
                            <FiLock className="w-8 h-8 text-gray-400" />
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
                        size="sm"
                        className="gap-2 text-xs rounded-lg w-full"
                        onClick={requestReadAccess}
                        disabled={isRequesting}>
                        <FiLock />
                        {isRequesting ? 'Sending request...' : 'Request Access'}
                    </Button>
                )}

                {requestStatus === AccessRequestStatus.PENDING && (
                    <div className="bg-yellow-44 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <FiClock className="w-5 h-5" />
                            <p className="text-sm font-medium">
                                Waiting for approval...
                            </p>
                        </div>
                    </div>
                )}

                {requestStatus === AccessRequestStatus.REJECTED && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                            <FiXCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">
                                Request was denied
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <p>
                        You are logged in as{' '}
                        <span className="font-medium">{userEmail}</span>
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs rounded-lg"
                        onClick={logout}
                        disabled={isLoggingOut}>
                        <LogOut />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
