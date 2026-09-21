'use client';

import { useCallback, useEffect, useState } from 'react';
import { getLegacyUserOnboardingStorageKey } from '@/lib/onboarding';

type SeenState = {
    userId: string | null;
    seen: boolean;
};

export function useDeviceOnboardingSeen(
    storageKey: string,
    userId: string | null | undefined
) {
    const currentUserId = userId ?? null;
    const [state, setState] = useState<SeenState | null>(null);

    useEffect(() => {
        const readSeenState = () => {
            try {
                const deviceSeen =
                    window.localStorage.getItem(storageKey) === 'true';
                const legacySeen = currentUserId
                    ? window.localStorage.getItem(
                          getLegacyUserOnboardingStorageKey(
                              currentUserId,
                              storageKey
                          )
                      ) === 'true'
                    : false;
                const seen = deviceSeen || legacySeen;

                if (legacySeen && !deviceSeen) {
                    window.localStorage.setItem(storageKey, 'true');
                }

                setState({ userId: currentUserId, seen });
            } catch (error) {
                console.warn(
                    `Failed to read device onboarding key "${storageKey}":`,
                    error
                );
                setState({ userId: currentUserId, seen: false });
            }
        };

        readSeenState();

        const handleStorage = (event: StorageEvent) => {
            if (event.key === storageKey) readSeenState();
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [currentUserId, storageKey]);

    const markSeen = useCallback(() => {
        try {
            window.localStorage.setItem(storageKey, 'true');
        } catch (error) {
            console.warn(
                `Failed to write device onboarding key "${storageKey}":`,
                error
            );
        }

        setState({ userId: currentUserId, seen: true });
    }, [currentUserId, storageKey]);

    const seen = state?.userId === currentUserId ? state.seen : undefined;

    return [seen, markSeen] as const;
}
