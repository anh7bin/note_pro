'use client';

import { useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';

interface AddCoverButtonProps {
    onAddCover: (file: File) => void;
    isUploading: boolean;
}

export function AddCoverButton({
    onAddCover,
    isUploading,
}: AddCoverButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useI18n();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddCover(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Button
                size="sm"
                onClick={handleClick}
                aria-busy={isUploading}
                disabled={isUploading}>
                <ImagePlus />
                {isUploading ? t('uploading') : t('addCover')}
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label={t('chooseCover')}
            />
        </>
    );
}
