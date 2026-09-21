'use client';

import { FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { DocumentMoreMenu } from '@/components/features/page/DocumentMoreMenu';
import { SidebarButton } from '@/components/layouts/main-layout/components/SidebarButton';
import { useI18n } from '@/contexts/I18nContext';
import type { GetStarredDocumentsQuery } from '@/graphql/__generated__/document-star.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentStar } from '@/hooks/useDocumentStar';
import { ROUTES } from '@/lib/routes';
import { getPlainText } from '@/lib/text';

type StarredDocument =
    GetStarredDocumentsQuery['document_stars'][number]['document'];

interface StarredDocumentItemProps {
    document: StarredDocument;
}

export function StarredDocumentItem({ document }: StarredDocumentItemProps) {
    const { t } = useI18n();
    const pathname = usePathname();
    const currentUserId = useUserId();
    const {
        isStarred,
        isLoading: isUpdatingStar,
        toggleStar,
    } = useDocumentStar(document.id, { initialIsStarred: true });

    if (!document.workspace_id) return null;

    const title = getPlainText(document.content?.title) || t('untitledPage');
    const icon = document.content?.icon;
    const href = document.folder?.id
        ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
              document.workspace_id,
              document.folder.id,
              document.id
          )
        : ROUTES.WORKSPACE_DOCUMENT(document.workspace_id, document.id);

    return (
        <DocumentMoreMenu
            documentId={document.id}
            workspaceId={document.workspace_id}
            folderId={document.folder?.id}
            isOwner={document.user_id === currentUserId}
            isStarred={isStarred}
            isUpdatingStar={isUpdatingStar}
            onToggleStar={() => void toggleStar()}>
            <div className="min-w-0">
                <SidebarButton
                    icon={
                        typeof icon === 'string' && icon.trim() ? (
                            <span aria-hidden="true" className="text-sm">
                                {icon}
                            </span>
                        ) : (
                            <FileText aria-hidden="true" className="h-4 w-4" />
                        )
                    }
                    label={title}
                    href={href}
                    isActive={pathname === href}
                />
            </div>
        </DocumentMoreMenu>
    );
}
