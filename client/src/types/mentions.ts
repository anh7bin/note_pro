export interface MentionUser {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
}

export const getMentionUserLabel = (user: MentionUser): string =>
    user.name?.trim() || user.email;

const normalizeSearchValue = (value: string): string =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .replace(/đ/g, 'd');

export function filterMentionUsers(
    users: MentionUser[],
    query: string,
    limit = 8
): MentionUser[] {
    const normalizedQuery = normalizeSearchValue(query.trim());

    return users
        .filter((user) => {
            if (!normalizedQuery) return true;
            return normalizeSearchValue(
                `${getMentionUserLabel(user)} ${user.email}`
            ).includes(normalizedQuery);
        })
        .slice(0, limit);
}

export interface MentionQuery {
    from: number;
    to: number;
    query: string;
}

export function findMentionQuery(
    value: string,
    cursor: number
): MentionQuery | null {
    const textBeforeCursor = value.slice(0, cursor);
    const triggerIndex = textBeforeCursor.lastIndexOf('@');
    if (triggerIndex < 0) return null;

    const characterBefore = textBeforeCursor[triggerIndex - 1];
    if (characterBefore && !/[\s([{]/.test(characterBefore)) return null;

    const query = textBeforeCursor.slice(triggerIndex + 1);
    if (/\s/.test(query) || query.includes('@') || query.length > 60) {
        return null;
    }

    return { from: triggerIndex, to: cursor, query };
}
