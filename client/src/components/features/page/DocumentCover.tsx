'use client';

import { useRef } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DocumentCoverProps {
    imageUrl: string;
    onRemove: () => void;
    onChangeCover: (file: File) => void;
    isUploading?: boolean;
}

export function DocumentCover({
    imageUrl,
    onRemove,
    onChangeCover,
    isUploading,
}: DocumentCoverProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        <div className="group relative h-[265px] w-full overflow-hidden bg-muted">
            <Image
                src={imageUrl}
                alt="Document cover"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <Button
                    size="sm"
                    onClick={handleChangeCover}
                    aria-busy={isUploading}
                    disabled={isUploading}>
                    <ImagePlus />
                    {isUploading ? 'Uploading…' : 'Change cover'}
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onRemove}
                    disabled={isUploading}>
                    <Trash2 />
                    Remove cover
                </Button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Choose a document cover image"
            />
        </div>
    );
}
