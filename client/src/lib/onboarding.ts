export const ONBOARDING_TOUR_VERSION = 'v1';

export const ONBOARDING_WORKSPACE_STORAGE_KEY = `onboarding_workspace_${ONBOARDING_TOUR_VERSION}`;
export const ONBOARDING_EDITOR_STORAGE_KEY = `onboarding_editor_${ONBOARDING_TOUR_VERSION}`;

const DEVICE_ONBOARDING_STORAGE_KEYS = new Set([
    ONBOARDING_WORKSPACE_STORAGE_KEY,
    ONBOARDING_EDITOR_STORAGE_KEY,
]);

export function isDeviceOnboardingStorageKey(key: string) {
    return DEVICE_ONBOARDING_STORAGE_KEYS.has(key);
}

export function getLegacyUserOnboardingStorageKey(
    userId: string,
    storageKey: string
) {
    return `user_#${userId}_${storageKey}`;
}
