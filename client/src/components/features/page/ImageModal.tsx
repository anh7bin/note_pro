'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
    Download,
    Maximize2,
    Minimize2,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/contexts/I18nContext';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    fileName: string;
}

export function ImageModal({
    isOpen,
    onClose,
    imageUrl,
    fileName,
}: ImageModalProps) {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            setZoom(1);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
        };
    }, []);

    const handleDownload = useCallback(async () => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Failed to download image');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
            toast.success(t('imageDownloaded'));
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error(t('imageDownloadError'));
            window.open(imageUrl, '_blank', 'noopener,noreferrer');
        }
    }, [imageUrl, fileName, t]);

    const handleZoomIn = useCallback(() => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
    }, []);

    const handleFullscreen = useCallback(async () => {
        const modalElement = document.querySelector(
            '[data-image-modal-content]'
        );
        if (!modalElement) return;

        try {
            if (!document.fullscreenElement) {
                await modalElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch {
            toast.error(t('fullscreenUnsupported'));
        }
    }, [t]);

    const controlClassName =
        'inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-white/25 bg-black/60 px-2 text-white transition-colors hover:border-white/40 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="h-[95dvh] w-[95vw] max-w-[95vw] overflow-hidden border-0 bg-black/95 p-0 [&>button]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:duration-200"
                data-image-modal-content>
                <DialogTitle className="sr-only">{fileName}</DialogTitle>
                <div className="absolute inset-x-2 top-2 z-50 flex items-start justify-between gap-2 animate-in fade-in-50 slide-in-from-top-2 sm:inset-x-4 sm:top-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <SimpleTooltip title={t('download')} side="bottom">
                            <button
                                type="button"
                                onClick={handleDownload}
                                className={controlClassName}>
                                <Download size={20} />
                            </button>
                        </SimpleTooltip>
                        <SimpleTooltip title={t('zoomOut')} side="bottom">
                            <button
                                type="button"
                                onClick={handleZoomOut}
                                disabled={zoom <= 0.5}
                                className={controlClassName}>
                                <ZoomOut size={20} />
                            </button>
                        </SimpleTooltip>
                        <SimpleTooltip title={t('resetZoom')} side="bottom">
                            <button
                                type="button"
                                onClick={handleZoomReset}
                                className={`${controlClassName} min-w-14 text-sm font-medium tabular-nums`}>
                                {Math.round(zoom * 100)}%
                            </button>
                        </SimpleTooltip>
                        <SimpleTooltip title={t('zoomIn')} side="bottom">
                            <button
                                type="button"
                                onClick={handleZoomIn}
                                disabled={zoom >= 3}
                                className={controlClassName}>
                                <ZoomIn size={20} />
                            </button>
                        </SimpleTooltip>
                        <SimpleTooltip
                            title={
                                isFullscreen
                                    ? t('exitFullscreen')
                                    : t('fullscreen')
                            }
                            side="bottom">
                            <button
                                type="button"
                                onClick={handleFullscreen}
                                className={controlClassName}>
                                {isFullscreen ? (
                                    <Minimize2 size={20} />
                                ) : (
                                    <Maximize2 size={20} />
                                )}
                            </button>
                        </SimpleTooltip>
                    </div>

                    <SimpleTooltip title={t('close')} side="bottom">
                        <button
                            type="button"
                            onClick={onClose}
                            className={controlClassName}>
                            <X size={24} />
                        </button>
                    </SimpleTooltip>
                </div>

                <div className="relative flex h-full w-full items-center justify-center overflow-auto p-4 pt-16 animate-in fade-in-50 zoom-in-95 sm:p-8 sm:pt-20">
                    <div
                        className="transition-transform duration-300 ease-out"
                        style={{
                            transform: `scale(${zoom})`,
                            cursor: zoom > 1 ? 'grab' : 'default',
                        }}>
                        <Image
                            src={imageUrl}
                            alt={fileName}
                            width={1920}
                            height={1080}
                            className="max-h-[85vh] w-auto object-contain"
                            priority
                            unoptimized
                            draggable={false}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
