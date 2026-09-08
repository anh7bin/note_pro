'use client';

import { useGetWorkspaceByUserIdQuery } from '@/graphql/queries/__generated__/workspace.generated';
import slugify from 'slugify';
import { useAuth } from '@/hooks/useAuth';

export function useWorkspace() {
    const { userId, isLoading: authLoading } = useAuth();

    const { data, loading, error, refetch } = useGetWorkspaceByUserIdQuery({
        variables: { userId: userId! },
        skip: !userId,
        fetchPolicy: 'cache-first',
    });

    const workspace = data?.workspaces?.[0];
    const workspaceSlug = workspace
        ? `${slugify(workspace.name ?? '', { strict: true })}--${workspace.id}`
        : null;

    return {
        workspace,
        workspaceSlug,
        loading: authLoading || (!!userId && loading),
        error,
        refetch,
        hasWorkspace: !!workspace,
    };
}
