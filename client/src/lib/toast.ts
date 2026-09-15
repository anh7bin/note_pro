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

export default showToast;
