'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    useDocumentPresenceSubscription,
    useHeartbeatDocumentPresenceMutation,
    useLeaveDocumentPresenceMutation,
} from '@/graphql/__generated__/document-presence.generated';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const HEARTBEAT_INTERVAL_MS = 25_000;
const PRESENCE_TIMEOUT_MS = 90_000;

export interface DocumentPresenceUser {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
    lastSeen: string;
    isCurrentUser: boolean;
}

export function useDocumentPresence(documentId: string) {
    const currentUser = useCurrentUser();
    const [, rerenderAtExpiration] = useState(0);
    const sessionId = useMemo(
        () =>
            documentId &&
            typeof crypto !== 'undefined' &&
            'randomUUID' in crypto
                ? crypto.randomUUID()
                : null,
        [documentId]
    );
    const canConnect = Boolean(documentId && currentUser.id && sessionId);

    const { data } = useDocumentPresenceSubscription({
        variables: { documentId },
        skip: !canConnect,
        ignoreResults: false,
    });
    const [heartbeat] = useHeartbeatDocumentPresenceMutation();
    const [leave] = useLeaveDocumentPresenceMutation();

    useEffect(() => {
        if (!canConnect || !currentUser.id || !sessionId) return;

        let stopped = false;
        let pendingHeartbeat: Promise<unknown> | null = null;
        const variables = {
            sessionId,
            documentId,
        };

        const sendHeartbeat = () => {
            if (stopped || pendingHeartbeat) return;

            pendingHeartbeat = heartbeat({ variables })
                .catch(() => {
                    // The next heartbeat retries after transient errors.
                })
                .finally(() => {
                    pendingHeartbeat = null;
                });
        };

        sendHeartbeat();
        const heartbeatTimer = window.setInterval(
            sendHeartbeat,
            HEARTBEAT_INTERVAL_MS
        );
        const handleVisible = () => {
            if (document.visibilityState === 'visible') sendHeartbeat();
        };

        document.addEventListener('visibilitychange', handleVisible);
        window.addEventListener('online', sendHeartbeat);

        return () => {
            stopped = true;
            window.clearInterval(heartbeatTimer);
            document.removeEventListener('visibilitychange', handleVisible);
            window.removeEventListener('online', sendHeartbeat);

            const leaveDocument = () =>
                leave({
                    variables: { sessionId, documentId },
                }).catch(() => {
                    // Stale sessions are hidden by timeout and cleaned server-side.
                });

            // A late heartbeat must never recreate a session after it was
            // removed while navigating away from the editor.
            if (pendingHeartbeat) {
                void pendingHeartbeat.finally(leaveDocument);
            } else {
                void leaveDocument();
            }
        };
    }, [canConnect, currentUser.id, documentId, heartbeat, leave, sessionId]);

    useEffect(() => {
        let expirationTimer: number | undefined;

        const scheduleNextExpiration = () => {
            const currentTime = Date.now();
            const nextExpiration = (data?.document_presence ?? []).reduce<
                number | null
            >((nearest, row) => {
                const expiresAt =
                    new Date(row.last_seen).getTime() + PRESENCE_TIMEOUT_MS;
                if (expiresAt <= currentTime) return nearest;
                return nearest === null || expiresAt < nearest
                    ? expiresAt
                    : nearest;
            }, null);

            if (nextExpiration === null) return;

            expirationTimer = window.setTimeout(
                () => {
                    rerenderAtExpiration((tick) => tick + 1);
                    scheduleNextExpiration();
                },
                nextExpiration - currentTime + 100
            );
        };

        scheduleNextExpiration();
        return () => {
            if (expirationTimer) window.clearTimeout(expirationTimer);
        };
    }, [data?.document_presence]);

    const now = Date.now();
    const activeRows = (data?.document_presence ?? []).filter(
        (row) => now - new Date(row.last_seen).getTime() < PRESENCE_TIMEOUT_MS
    );
    const users = new Map<string, DocumentPresenceUser>();

    for (const row of activeRows) {
        if (users.has(row.user_id)) continue;
        users.set(row.user_id, {
            id: row.user.id,
            name: row.user.name ?? null,
            email: row.user.email,
            avatarUrl: row.user.avatar_url ?? null,
            lastSeen: row.last_seen,
            isCurrentUser: row.user_id === currentUser.id,
        });
    }

    // The person viewing this screen is present immediately, including the
    // document owner, while the first subscription event is in flight.
    if (currentUser.id && currentUser.email && !users.has(currentUser.id)) {
        users.set(currentUser.id, {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            avatarUrl: currentUser.image,
            lastSeen: new Date(now).toISOString(),
            isCurrentUser: true,
        });
    }

    return Array.from(users.values()).sort((a, b) => {
        if (a.isCurrentUser) return -1;
        if (b.isCurrentUser) return 1;
        return b.lastSeen.localeCompare(a.lastSeen);
    });
}
