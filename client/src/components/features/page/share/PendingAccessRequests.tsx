import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PendingAccessRequest } from './share.types';
import { getUserInitials } from './share.utils';

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
}: PendingAccessRequestsProps) => (
    <section className="space-y-2" aria-labelledby="pending-requests-heading">
        <h3
            id="pending-requests-heading"
            className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pending requests
        </h3>
        {requests.map((request) => {
            const isProcessing = processingRequestId === request.id;

            return (
                <div
                    key={request.id}
                    className="flex flex-col gap-3 rounded-md border border-info/20 bg-info-subtle p-3 sm:flex-row sm:items-center">
                    <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage
                            src={request.requester?.avatar_url || ''}
                            alt={request.requester?.name || 'User'}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {getUserInitials(
                                request.requester?.name,
                                request.requester?.email
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                            {request.requester?.name || 'User'} wants to{' '}
                            {request.permission_type === 'write'
                                ? 'edit'
                                : 'view'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {request.requester?.email}
                        </p>
                    </div>

                    <div className="flex shrink-0 gap-2 self-end sm:self-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void onDecline(request)}
                            disabled={isProcessing}>
                            Decline
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => void onApprove(request)}
                            disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Approve'}
                        </Button>
                    </div>
                </div>
            );
        })}
    </section>
);
