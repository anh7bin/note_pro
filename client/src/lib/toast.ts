import { toast } from 'sonner';
import { TOAST_DURATION } from './constants';

// Toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

// Toast utility functions
export const showToast = {
    success: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        return toast.success(message, {
            description: options?.description,
            duration: options?.duration ?? 3000,
        });
    },

    error: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        return toast.error(message, {
            description: options?.description,
            duration: options?.duration ?? TOAST_DURATION,
        });
    },

    info: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        return toast.info(message, {
            description: options?.description,
            duration: options?.duration ?? 4000,
        });
    },

    warning: (
        message: string,
        options?: { description?: string; duration?: number }
    ) => {
        return toast.warning(message, {
            description: options?.description,
            duration: options?.duration ?? 4000,
        });
    },

    loading: (message: string, options?: { description?: string }) => {
        return toast.loading(message, {
            description: options?.description,
        });
    },

    promise: <T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error | unknown) => string);
        }
    ) => {
        return toast.promise(promise, messages);
    },

    dismiss: (toastId?: string | number) => {
        return toast.dismiss(toastId);
    },

    // Custom toast with action
    custom: (
        message: string,
        options?: {
            description?: string;
            action?: {
                label: string;
                onClick: () => void;
            };
            duration?: number;
        }
    ) => {
        return toast(message, {
            description: options?.description,
            duration: options?.duration ?? 4000,
            action: options?.action
                ? {
                      label: options.action.label,
                      onClick: options.action.onClick,
                  }
                : undefined,
        });
    },
};

// Common toast messages
export const commonToasts = {
    // Success messages
    saveSuccess: () => showToast.success('Changes saved successfully'),
    createSuccess: (item: string) =>
        showToast.success(`${item} created successfully`),
    updateSuccess: (item: string) =>
        showToast.success(`${item} updated successfully`),
    deleteSuccess: (item: string) =>
        showToast.success(`${item} deleted successfully`),

    // Error messages
    saveError: () =>
        showToast.error('Failed to save changes', {
            description: 'Please try again',
        }),
    loadError: () =>
        showToast.error('Failed to load data', {
            description: 'Please refresh the page',
        }),
    networkError: () =>
        showToast.error('Network error', {
            description: 'Please check your connection',
        }),
    unknownError: () =>
        showToast.error('Something went wrong', {
            description: 'Please try again',
        }),

    // Info messages
    autoSaved: () => showToast.info('Auto-saved', { duration: 2000 }),
    copied: () => showToast.success('Copied to clipboard', { duration: 2000 }),

    // Loading messages
    saving: () => showToast.loading('Saving changes...'),
    loading: (action: string) => showToast.loading(`${action}...`),
};

export default showToast;
