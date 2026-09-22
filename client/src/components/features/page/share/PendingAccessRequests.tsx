import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { PendingAccessRequest } from './share.types';

type PendingAccessRequestsProps = {
    requests: PendingAccessRequest[];
    processingRequestId: string | null;
    onApprove: (request: PendingAccessRequest) => Promise<void>;
    onDecline: (request: PendingAccessRequest) => Promise<void>;
};

export const PendingAccessRequests = ({
    requests,
    processingRequestId,
    onApprove,
    onDecline,
}: PendingAccessRequestsProps) => {
    const { t } = useI18n();

    return (
        <section className="space-y-2">
            <h3
                id="pending-requests-heading"
                className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('pendingRequests')}
            </h3>
            {requests.map((request) => {
                const isProcessing = processingRequestId === request.id;

                return (
                    <div
                        key={request.id}
                        className="flex flex-col gap-3 rounded-md border border-info/20 bg-info-subtle p-1.5 sm:flex-row sm:items-center">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                                src={request.requester?.avatar_url || ''}
                                alt={request.requester?.name || t('user')}
                            />
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                                {t(
                                    request.permission_type === 'write'
                                        ? 'wantsToEdit'
                                        : 'wantsToView',
                                    {
                                        name:
                                            request.requester?.name ||
                                            t('user'),
                                    }
                                )}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {request.requester?.email}
                            </p>
                        </div>

                        <div className="flex shrink-0 gap-1.5 self-end sm:self-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => void onDecline(request)}
                                disabled={isProcessing}>
                                {t('decline')}
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => void onApprove(request)}
                                disabled={isProcessing}>
                                {isProcessing ? t('processing') : t('approve')}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};
