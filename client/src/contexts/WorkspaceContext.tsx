'use client';

import { useGetWorkspaceByUserIdQuery } from '@/graphql/queries/__generated__/workspace.generated';
import { useAuth } from '@/hooks/useAuth';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import slugify from 'slugify';

type WorkspaceContextValue = ReturnType<typeof useWorkspaceValue>;

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
    undefined
);

function useWorkspaceValue() {
    const { userId, isLoading: authLoading } = useAuth();
    const { data, loading, error, refetch } = useGetWorkspaceByUserIdQuery({
        variables: { userId: userId ?? '' },
        skip: !userId,
        fetchPolicy: 'cache-first',
    });

    const workspace = data?.workspaces?.[0] ?? null;
    const workspaceId = workspace?.id ?? null;
    const workspaceSlug = useMemo(
        () =>
            workspace
                ? `${slugify(workspace.name ?? '', { strict: true })}--${workspace.id}`
                : null,
        [workspace]
    );
    const workspaceLoading = authLoading || (!!userId && loading);

    return useMemo(
        () => ({
            workspace,
            workspaceId,
            workspaceSlug,
            loading: workspaceLoading,
            error,
            refetch,
        }),
        [
            workspace,
            workspaceId,
            workspaceSlug,
            workspaceLoading,
            error,
            refetch,
        ]
    );
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const value = useWorkspaceValue();

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
