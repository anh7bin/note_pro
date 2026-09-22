'use client';

import { useRef } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

interface DocumentCoverProps {
    imageUrl: string;
    onRemove: () => void;
    onChangeCover: (file: File) => void;
    editable: boolean;
    isUploading?: boolean;
}

export function DocumentCover({
    imageUrl,
    onRemove,
    onChangeCover,
    editable,
    isUploading,
}: DocumentCoverProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useI18n();

    const handleChangeCover = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChangeCover(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={handleChangeCover}
                            disabled={isUploading}>
                            <ImagePlus />
                            {isUploading ? t('uploading') : t('changeCover')}
                        </Button>
                        <Button
                            variant="destructive"
                            size="xs"
                            onClick={onRemove}
                            disabled={isUploading}>
                            <Trash2 />
                            {t('removeCover')}
                        </Button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label={t('chooseCover')}
                    />
                </>
            )}
        </div>
    );
}
