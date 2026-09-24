import { authOptions } from '@/lib/auth';
import { getUserIdFromToken } from '@/lib/auth/token';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

type Invitee = {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
};

type HasuraResponse = {
    data?: {
        blocks_by_pk: { user_id: string } | null;
        users: Invitee[];
    };
    errors?: unknown;
};

const rateLimits = new Map<string, RateLimitEntry>();

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const current = rateLimits.get(userId);

    if (!current || current.resetAt <= now) {
        rateLimits.set(userId, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        return false;
    }

    current.count += 1;
    return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function getGraphqlEndpoint(endpoint?: string): string {
    if (!endpoint) return '';

    const normalizedEndpoint = endpoint.replace(/\/+$/, '');
    return normalizedEndpoint.endsWith('/v1/graphql')
        ? normalizedEndpoint
        : `${normalizedEndpoint}/v1/graphql`;
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.token ? getUserIdFromToken(session.token) : null;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isRateLimited(userId)) {
        return NextResponse.json(
            { error: 'Too many invite searches' },
            { status: 429 }
        );
    }

    let body: { documentId?: unknown; email?: unknown };

    try {
        body = (await request.json()) as typeof body;
    } catch {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    const documentId =
        typeof body.documentId === 'string' ? body.documentId : '';
    const email =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (
        !UUID_PATTERN.test(documentId) ||
        email.length > 254 ||
        !EMAIL_PATTERN.test(email)
    ) {
        return NextResponse.json(
            { error: 'A valid document and email are required' },
            { status: 400 }
        );
    }

    const endpoint = getGraphqlEndpoint(
        process.env.NEXT_PUBLIC_HASURA_SERVER_ENDPOINT
    );
    const adminSecret = process.env.HASURA_GRAPHQL_ADMIN_SECRET;

    if (!endpoint || !adminSecret) {
        return NextResponse.json(
            { error: 'Invite search is unavailable' },
            { status: 503 }
        );
    }

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Hasura-Admin-Secret': adminSecret,
        },
        body: JSON.stringify({
            query: `
                query FindInvitee($documentId: uuid!, $email: String!) {
                    blocks_by_pk(id: $documentId) {
                        user_id
                    }
                    users(where: { email: { _eq: $email } }, limit: 1) {
                        id
                        email
                        name
                        avatar_url
                    }
                }
            `,
            variables: { documentId, email },
        }),
        cache: 'no-store',
    });

    if (!response.ok) {
        return NextResponse.json(
            { error: 'Invite search is unavailable' },
            { status: 502 }
        );
    }

    const result = (await response.json()) as HasuraResponse;

    if (result.errors || !result.data) {
        return NextResponse.json(
            { error: 'Invite search is unavailable' },
            { status: 502 }
        );
    }

    if (result.data.blocks_by_pk?.user_id !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ user: result.data.users[0] ?? null });
}
