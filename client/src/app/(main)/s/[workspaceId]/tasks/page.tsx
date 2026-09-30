'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { PageLoading } from '@/components/ui/loading';

export default function TasksPage() {
    const { workspaceSlug } = useWorkspace();
    const router = useRouter();

    useEffect(() => {
        if (workspaceSlug) {
            router.replace(ROUTES.WORKSPACE_TASKS_INBOX(workspaceSlug));
        }
    }, [workspaceSlug, router]);

    return <PageLoading />;
}
