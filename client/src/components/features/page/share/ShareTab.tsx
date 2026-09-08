'use client';

import { Share2 } from 'lucide-react';
import { PendingAccessRequests } from './PendingAccessRequests';
import { SharedUsersList } from './SharedUsersList';
import { UserEmailAutocomplete } from './UserEmailAutocomplete';
import { useDocumentSharing } from './hooks/useDocumentSharing';

interface ShareTabProps {
    documentId: string;
}

export function ShareTab({ documentId }: ShareTabProps) {
    const {
        currentUserId,
        isOwner,
        isLoading,
        sharedUsers,
        owner,
        pendingRequests,
        processingRequestId,
        excludeUserIds,
        onSelectUser,
        onRoleChange,
        onRemoveUser,
        onApproveRequest,
        onDeclineRequest,
    } = useDocumentSharing(documentId);

    return (
        <div className="space-y-5 py-2">
            {isOwner && pendingRequests.length > 0 && (
                <PendingAccessRequests
                    requests={pendingRequests}
                    processingRequestId={processingRequestId}
                    onApprove={onApproveRequest}
                    onDecline={onDeclineRequest}
                />
            )}

            <section aria-labelledby="invite-collaborators-heading">
                <div className="flex items-center gap-2">
                    <Share2
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <h3
                        id="invite-collaborators-heading"
                        className="text-sm font-semibold">
                        Invite collaborators
                    </h3>
                </div>
                <p className="mb-3 mt-1 text-sm text-muted-foreground">
                    Search for a Bin Craft user by email and grant access to
                    this document.
                </p>

                {isOwner && (
                    <UserEmailAutocomplete
                        onSelectUser={onSelectUser}
                        excludeUserIds={excludeUserIds}
                        placeholder="Search by email"
                    />
                )}
            </section>

            <SharedUsersList
                users={sharedUsers}
                owner={owner}
                onRoleChange={onRoleChange}
                onRemoveUser={onRemoveUser}
                currentUserId={currentUserId}
                canManageUsers={isOwner}
                isLoading={isLoading}
            />
        </div>
    );
}
