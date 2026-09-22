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
import { useI18n } from '@/contexts/I18nContext';

interface ShareTabProps {
    documentId: string;
    onInviteModeChange?: (isInviting: boolean) => void;
}

export function ShareTab({ documentId, onInviteModeChange }: ShareTabProps) {
    const [inviteOpen, setInviteOpen] = useState(false);
    const { t } = useI18n();
    const {
        currentUserId,
        isOwner,
        canManageLinkAccess,
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

            <section className="rounded-lg bg-muted/40">
                <div className="flex items-center gap-2">
                    <TbUsers />
                    <h3 className="text-sm font-semibold">
                        {t('inviteCollaborators')}
                    </h3>
                </div>
                <p className="mb-2 mt-1 text-sm text-muted-foreground">
                    {t('inviteCollaboratorsDescription')}
                </p>

                {isOwner && (
                    <Input
                        readOnly
                        placeholder={t('addEmails')}
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

            <section className="rounded-lg bg-muted/40">
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1fr)_9rem]">
                    <PermissionSelector
                        value={linkPermission}
                        disabled={
                            !canManageLinkAccess || isUpdatingLinkPermission
                        }
                        onChange={(value: LinkPermissionType) =>
                            void onLinkPermissionChange(value)
                        }
                    />
                    <Button
                        size="sm"
                        className="w-full px-3"
                        onClick={() => void onCopyLink()}>
                        <Copy />
                        {t('copyLink')}
                    </Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    {canManageLinkAccess
                        ? t('chooseLinkAccess')
                        : t('editAccessRequiredForLinkAccess')}
                </p>
            </section>
        </div>
    );
}
