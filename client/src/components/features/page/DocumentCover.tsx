'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';
import { DocumentCoverPicker } from './DocumentCoverPicker';

interface DocumentCoverProps {
    imageUrl: string;
    onRemove: () => void;
    onChangeCover: (file: File) => Promise<boolean>;
    onSelectCover: (cover: string) => Promise<boolean>;
    editable: boolean;
    isUploading?: boolean;
}

export function DocumentCover({
    imageUrl,
    onRemove,
    onChangeCover,
    onSelectCover,
    editable,
    isUploading,
}: DocumentCoverProps) {
    const { t } = useI18n();

    return (
        <div className="group relative h-48 w-full overflow-hidden bg-muted sm:h-[280px]">
            <Image
                src={imageUrl}
                alt={t('documentCover')}
                fill
                className="object-cover"
                priority
            />
            {editable && (
                <>
                    <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                        <DocumentCoverPicker
                            currentCover={imageUrl}
                            triggerLabel={t('changeCover')}
                            triggerVariant="outline"
                            onSelectCover={onSelectCover}
                            onUploadCover={onChangeCover}
                            isUploading={Boolean(isUploading)}
                        />
                        <Button
                            variant="destructive"
                            size="xs"
                            onClick={onRemove}
                            disabled={isUploading}>
                            <Trash2 />
                            {t('removeCover')}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
