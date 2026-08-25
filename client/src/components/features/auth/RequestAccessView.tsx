'use client';

import { useLogout } from '@/hooks';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FiLock, FiClock, FiXCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useUserId } from '@/hooks/useAuth';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useCreateAccessRequestMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useCreateNotificationMutation } from '@/graphql/mutations/__generated__/notification.generated';
import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { AccessRequestStatus, PermissionType } from '@/types/types';
import { Loading } from '@/components/ui/loading';

interface RequestAccessViewProps {
    documentId: string;
}

export function RequestAccessView({ documentId }: RequestAccessViewProps) {
    const { logout, isLoggingOut } = useLogout();
    const { data: session } = useSession();
    const userId = useUserId();
    const [isRequesting, setIsRequesting] = useState(false);

    const {
        data: accessRequestData,
        loading: accessRequestLoading,
        refetch,
    } = useGetAccessRequestByDocumentQuery({
        variables: {
            documentId: documentId || '',
            requesterId: userId || '',
        },
        skip: !documentId || !userId,
        fetchPolicy: 'cache-and-network',
    });

    const [createAccessRequest] = useCreateAccessRequestMutation();
    const [createNotification] = useCreateNotificationMutation();

    const existingRequest = accessRequestData?.access_requests?.[0];
    const requestStatus = existingRequest?.status;

    const handleRequestAccess = async (permissionType: PermissionType) => {
        if (!userId || isRequesting) return;

        try {
            setIsRequesting(true);

            const result = await createAccessRequest({
                variables: {
                    input: {
                        document_id: documentId,
                        requester_id: userId,
                        message: `${session?.user?.email} requested ${permissionType} access`,
                        permission_type: permissionType,
                        status: AccessRequestStatus.PENDING,
                    },
                },
            });

            const accessRequest = result.data?.insert_access_requests_one;

            if (accessRequest?.owner_id) {
                await createNotification({
                    variables: {
                        input: {
                            user_id: accessRequest.owner_id,
                            type: 'access_request',
                            title: 'New access request',
                            message: `${session?.user?.email} requested ${permissionType} access to your document`,
                            data: {
                                request_id: accessRequest.id,
                                document_id: documentId,
                                requester_id: userId,
                                requester_email: session?.user?.email,
                                permission_type: permissionType,
                            },
                        },
                    },
                });
            }

            showToast.success('Access request sent successfully');
            await refetch();
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            if (errorMessage.includes('Uniqueness violation')) {
                showToast.error(
                    'You have already requested access to this document'
                );
            } else {
                console.error('Failed to send access request:', error);
                showToast.error('Failed to send access request');
            }
        } finally {
            setIsRequesting(false);
        }
    };

    return accessRequestLoading ? (
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
                        onClick={() => handleRequestAccess(PermissionType.READ)}
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
                        <span className="font-medium">
                            {session?.user?.email}
                        </span>
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
