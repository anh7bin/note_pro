'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/I18nContext';
import { Copy, Link2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { PendingAccessRequests } from './PendingAccessRequests';
import {
    PermissionSelector,
    type LinkPermissionType,
} from './PermissionSelector';
import { SharedUsersList } from './SharedUsersList';
import { UserEmailAutocomplete } from './UserEmailAutocomplete';
import { useDocumentSharing } from './hooks/useDocumentSharing';

interface ShareTabProps {
    documentId: string;
}

export function ShareTab({ documentId }: ShareTabProps) {
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
            <div className="max-h-[min(36rem,calc(100vh-2rem))] overflow-y-auto p-4">
                <UserEmailAutocomplete
                    documentId={documentId}
                    documentTitle={documentTitle}
                    excludeUserIds={excludeUserIds}
                    onInviteUsers={onInviteUsers}
                    onClose={() => setInviteOpen(false)}
                />
            </div>
        );
    }

    return (
        <div className="flex max-h-[min(36rem,calc(100vh-2rem))] flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
                {isOwner && pendingRequests.length > 0 && (
                    <PendingAccessRequests
                        requests={pendingRequests}
                        processingRequestId={processingRequestId}
                        onApprove={onApproveRequest}
                        onDecline={onDeclineRequest}
                    />
                )}
                {isOwner && (
                    <section className="space-y-3">
                        <div className="flex items-start gap-2.5">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <UserPlus
                                    className="size-4"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold">
                                    {t('inviteCollaborators')}
                                </h3>
                                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                                    {t('inviteCollaboratorsDescription')}
                                </p>
                            </div>
                        </div>

                        <Input
                            readOnly
                            placeholder={t('addEmails')}
                            className="h-9 cursor-text bg-background"
                            onClick={() => setInviteOpen(true)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault();
                                    setInviteOpen(true);
                                }
                            }}
                        />
                    </section>
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

                <section className="space-y-2 rounded-lg border border-border-subtle bg-muted/30 p-3">
                    <div className="flex items-start gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground shadow-sm">
                            <Link2 className="size-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold">
                                {t('linkAccess')}
                            </h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                {canManageLinkAccess
                                    ? t('chooseLinkAccess')
                                    : t('editAccessRequiredForLinkAccess')}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_9rem]">
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
                </section>
            </div>
        </div>
    );
}
