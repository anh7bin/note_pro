'use client';

import { FiShare2 } from 'react-icons/fi';
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
        <div className="px-2 py-4">
            {isOwner && pendingRequests.length > 0 && (
                <PendingAccessRequests
                    requests={pendingRequests}
                    processingRequestId={processingRequestId}
                    onApprove={onApproveRequest}
                    onDecline={onDeclineRequest}
                />
            )}

            <div className="flex items-center gap-2">
                <FiShare2 className="h-4 w-4" />
                <h3 className="text-sm font-bold">Invite to Collaborate</h3>
            </div>
            <p className="my-2 text-sm text-muted-foreground">
                For easy collaboration with anyone, even without a Bin account
            </p>

            {isOwner && (
                <UserEmailAutocomplete
                    onSelectUser={onSelectUser}
                    excludeUserIds={excludeUserIds}
                    placeholder="Add emails to invite"
                />
            )}

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
