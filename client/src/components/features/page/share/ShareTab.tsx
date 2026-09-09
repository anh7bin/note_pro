'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { PendingAccessRequests } from './PendingAccessRequests';
import { TbUsers } from 'react-icons/tb';
import {
    PermissionSelector,
    type LinkPermissionType,
} from './PermissionSelector';
import { SharedUsersList } from './SharedUsersList';
import { UserEmailAutocomplete } from './UserEmailAutocomplete';
import { useDocumentSharing } from './hooks/useDocumentSharing';

interface ShareTabProps {
    documentId: string;
    onInviteModeChange?: (isInviting: boolean) => void;
}

export function ShareTab({ documentId, onInviteModeChange }: ShareTabProps) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const {
        currentUserId,
        isOwner,
        isLoading,
        sharedUsers,
        owner,
        pendingRequests,
        processingRequestId,
        excludeUserIds,
        documentTitle,
        linkPermission,
        isUpdatingLinkPermission,
        onInviteUsers,
        onLinkPermissionChange,
        onCopyLink,
        onRoleChange,
        onRemoveUser,
        onApproveRequest,
        onDeclineRequest,
    } = useDocumentSharing(documentId);

    if (inviteOpen) {
        return (
            <UserEmailAutocomplete
                documentTitle={documentTitle}
                excludeUserIds={excludeUserIds}
                onInviteUsers={onInviteUsers}
                onClose={() => {
                    setInviteOpen(false);
                    onInviteModeChange?.(false);
                }}
            />
        );
    }

    return (
        <div className="space-y-2 py-2">
            {isOwner && pendingRequests.length > 0 && (
                <PendingAccessRequests
                    requests={pendingRequests}
                    processingRequestId={processingRequestId}
                    onApprove={onApproveRequest}
                    onDecline={onDeclineRequest}
                />
            )}

            <section
                aria-labelledby="invite-collaborators-heading"
                className="rounded-lg bg-muted/40 p-3">
                <div className="flex items-center gap-2">
                    <TbUsers />
                    <h3
                        id="invite-collaborators-heading"
                        className="text-sm font-semibold">
                        Invite collaborators
                    </h3>
                </div>
                <p className="mb-2 mt-1 text-sm text-muted-foreground">
                    For easy collaboration with anyone, even without a Bin Craft
                    account
                </p>

                {isOwner && (
                    <Input
                        readOnly
                        aria-label="Add people to this document"
                        placeholder="Add emails to invite"
                        className="cursor-text bg-background"
                        onClick={() => {
                            setInviteOpen(true);
                            onInviteModeChange?.(true);
                        }}
                        onFocus={() => {
                            setInviteOpen(true);
                            onInviteModeChange?.(true);
                        }}
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
            </section>

            <section
                aria-label="Link access"
                className="rounded-lg bg-muted/40 p-3">
                <div className="flex gap-2">
                    <PermissionSelector
                        value={linkPermission}
                        disabled={!isOwner || isUpdatingLinkPermission}
                        onChange={(value: LinkPermissionType) =>
                            void onLinkPermissionChange(value)
                        }
                    />
                    <Button
                        type="button"
                        className="shrink-0"
                        onClick={() => void onCopyLink()}>
                        <Copy aria-hidden="true" />
                        Copy link
                    </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    {isOwner
                        ? 'Choose who can open this link.'
                        : 'Only the document owner can change link access.'}
                </p>
            </section>
        </div>
    );
}
