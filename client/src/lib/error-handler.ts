import { showToast } from './toast';

export function handleMutationError(
    error: unknown,
    context: string,
    userMessage: string
) {
    console.error(`Error ${context}:`, error);
    showToast.error(userMessage);
}

export function handleMutationSuccess(message: string) {
    showToast.success(message);
}
