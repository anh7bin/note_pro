import { useRef, useCallback } from 'react';

export type DebouncedCallback = () => void | Promise<void>;

export interface DebounceController {
    debounced: (callback: DebouncedCallback, key?: string) => void;
    flush: () => void;
    flushAsync: () => Promise<void>;
    cancel: (key?: string) => void;
}

const DEFAULT_KEY = '__default__';

export const useDebounce = (delay: number): DebounceController => {
    const pendingChangesRef = useRef<Map<string, DebouncedCallback>>(new Map());
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map()
    );
    const inFlightRef = useRef<Set<Promise<void>>>(new Set());

    const runCallback = useCallback((callback: DebouncedCallback) => {
        const promise = Promise.resolve()
            .then(callback)
            .catch((error) => {
                console.error('Error executing debounced callback:', error);
            });

        inFlightRef.current.add(promise);
        void promise.finally(() => inFlightRef.current.delete(promise));
        return promise;
    }, []);

    const runKey = useCallback(
        (key: string) => {
            const timer = timersRef.current.get(key);
            if (timer) clearTimeout(timer);
            timersRef.current.delete(key);

            const callback = pendingChangesRef.current.get(key);
            if (!callback) return undefined;

            pendingChangesRef.current.delete(key);
            return runCallback(callback);
        },
        [runCallback]
    );

    const debounced = useCallback(
        (callback: DebouncedCallback, key = DEFAULT_KEY) => {
            pendingChangesRef.current.set(key, callback);

            const existingTimer = timersRef.current.get(key);
            if (existingTimer) clearTimeout(existingTimer);

            timersRef.current.set(
                key,
                setTimeout(() => runKey(key), delay)
            );
        },
        [delay, runKey]
    );

    const flush = useCallback(() => {
        const keys = Array.from(pendingChangesRef.current.keys());
        keys.forEach((key) => {
            void runKey(key);
        });
    }, [runKey]);

    const flushAsync = useCallback(async () => {
        const existingPromises = Array.from(inFlightRef.current);
        const newPromises = Array.from(pendingChangesRef.current.keys())
            .map(runKey)
            .filter((promise): promise is Promise<void> => Boolean(promise));

        await Promise.all([...existingPromises, ...newPromises]);
    }, [runKey]);

    const cancel = useCallback((key?: string) => {
        if (key) {
            const timer = timersRef.current.get(key);
            if (timer) clearTimeout(timer);
            timersRef.current.delete(key);
            pendingChangesRef.current.delete(key);
            return;
        }

        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current.clear();
        pendingChangesRef.current.clear();
    }, []);

    return { debounced, flush, flushAsync, cancel };
};
