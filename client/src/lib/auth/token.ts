export function getUserIdFromToken(token: string): string | null {
    try {
        const parts = token.split('.');
        if (parts.length < 2 || !parts[1]) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(
            Math.ceil(base64.length / 4) * 4,
            '='
        );
        const payload = JSON.parse(atob(paddedBase64));
        return (
            payload['https://hasura.io/jwt/claims']?.['x-hasura-user-id'] ||
            null
        );
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
