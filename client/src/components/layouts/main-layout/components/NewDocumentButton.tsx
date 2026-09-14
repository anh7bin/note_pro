'use client';

import { useCreateDocument } from '@/hooks';
import { useParams } from 'next/navigation';
import { FilePlus2 } from 'lucide-react';
import { SidebarButton } from './SidebarButton';
import { useI18n } from '@/contexts/I18nContext';

export default function NewDocumentButton() {
    const params = useParams();
    const folderId = params.folderId as string | null;
    const { createNewDocument, isCreating, canCreate } = useCreateDocument({
        folderId,
    });
    const { t } = useI18n();

    return (
        <SidebarButton
            icon={<FilePlus2 className="h-4 w-4" />}
            label={t('newDocument')}
            onClick={createNewDocument}
            disabled={!canCreate || isCreating}
            isLoading={isCreating}
        />
    );
}
