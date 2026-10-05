'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { Check, ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/contexts/I18nContext';
import showToast from '@/lib/toast';
import { cn } from '@/lib/utils';

const COLOR_COVERS = [
    '/images/covers/solid-coral.webp',
    '/images/covers/solid-amber.webp',
    '/images/covers/solid-ocean.webp',
    '/images/covers/solid-sand.webp',
    '/images/covers/gradient-aqua.webp',
    '/images/covers/gradient-berry.webp',
    '/images/covers/gradient-ember.webp',
    '/images/covers/gradient-mist.webp',
] as const;

const TEXTURE_COVERS = [
    '/images/covers/sandstone.webp',
    '/images/covers/ocean-mineral.webp',
    '/images/covers/frosted-coral.webp',
    '/images/covers/celestial-slate.webp',
] as const;

const NATURE_COVERS = [
    '/images/covers/nature-alpine-dawn.webp',
    '/images/covers/nature-ocean-shore.webp',
    '/images/covers/nature-botanical-light.webp',
] as const;

const ARCHITECTURE_COVERS = [
    '/images/covers/architecture-concrete-arches.webp',
    '/images/covers/architecture-city-blue-hour.webp',
    '/images/covers/architecture-terracotta.webp',
] as const;

const ART_COVERS = [
    '/images/covers/art-paper-waves.webp',
    '/images/covers/art-aurora-ribbons.webp',
    '/images/covers/art-topographic-relief.webp',
] as const;

interface DocumentCoverPickerProps {
    currentCover?: string;
    triggerLabel: string;
    triggerVariant?: 'ghost' | 'outline';
    onSelectCover: (cover: string) => Promise<boolean>;
    onUploadCover: (file: File) => Promise<boolean>;
    isUploading: boolean;
}

export function DocumentCoverPicker({
    currentCover,
    triggerLabel,
    triggerVariant = 'ghost',
    onSelectCover,
    onUploadCover,
    isUploading,
}: DocumentCoverPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useI18n();
    const isBusy = isUploading || isSaving;

    const applyCover = async (cover: string) => {
        if (isBusy || cover === currentCover) return;

        setIsSaving(true);
        const didSave = await onSelectCover(cover);
        setIsSaving(false);

        if (didSave) {
            setIsOpen(false);
        } else {
            showToast.error(t('documentCoverUpdateError'));
        }
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || isBusy) return;

        const didSave = await onUploadCover(file);
        if (didSave) {
            setIsOpen(false);
        }
    };

    const renderCoverOption = (cover: string) => {
        const isSelected = currentCover === cover;

        return (
            <button
                key={cover}
                type="button"
                disabled={isBusy}
                onClick={() => void applyCover(cover)}
                className={cn(
                    'group/cover relative aspect-[16/9] overflow-hidden rounded-md border border-border/70 bg-muted',
                    'touch-manipulation transition-[border-color,box-shadow,opacity] duration-150',
                    'hover:border-foreground/35 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    isSelected && 'border-primary ring-2 ring-primary/40'
                )}>
                <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 25vw, 96px"
                    className="object-cover transition-transform duration-200 group-hover/cover:scale-[1.03] motion-reduce:transition-none"
                />
                {isSelected && (
                    <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-primary-button text-primary-foreground shadow-sm">
                        <Check className="size-3.5" />
                    </span>
                )}
            </button>
        );
    };

    return (
        <PopoverPanel
            open={isOpen}
            onOpenChange={setIsOpen}
            trigger={
                <Button variant={triggerVariant} size="xs" disabled={isBusy}>
                    {isBusy ? (
                        <LoaderCircle
                            aria-hidden="true"
                            className="animate-spin motion-reduce:animate-none"
                        />
                    ) : (
                        <ImagePlus aria-hidden="true" />
                    )}
                    {isBusy
                        ? isUploading
                            ? t('uploading')
                            : t('updatingCover')
                        : triggerLabel}
                </Button>
            }
            contentProps={{
                align: 'start',
                side: 'bottom',
                sideOffset: 8,
                collisionPadding: 16,
                className:
                    'w-[min(26rem,calc(100vw-2rem))] overflow-hidden p-0',
            }}>
            <Tabs defaultValue="library" className="w-full">
                <div className="border-b border-border px-2 pt-2">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                        <TabsTrigger
                            value="library"
                            className="rounded-b-none border-b-2 border-transparent shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                            {t('coverLibrary')}
                        </TabsTrigger>
                        <TabsTrigger
                            value="upload"
                            className="rounded-b-none border-b-2 border-transparent shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                            {t('uploadCover')}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent
                    value="library"
                    className="m-0 max-h-[min(28rem,60vh)] overflow-y-auto p-3">
                    <section>
                        <h3
                            id="cover-colors-heading"
                            className="mb-2 text-xs font-medium text-muted-foreground">
                            {t('coverColorsGradients')}
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {COLOR_COVERS.map(renderCoverOption)}
                        </div>
                    </section>

                    <section className="mt-4">
                        <h3
                            id="cover-textures-heading"
                            className="mb-2 text-xs font-medium text-muted-foreground">
                            {t('coverTextures')}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {TEXTURE_COVERS.map((cover) =>
                                renderCoverOption(cover)
                            )}
                        </div>
                    </section>

                    <section className="mt-4">
                        <h3
                            id="cover-nature-heading"
                            className="mb-2 text-xs font-medium text-muted-foreground">
                            {t('coverNature')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {NATURE_COVERS.map((cover) =>
                                renderCoverOption(cover)
                            )}
                        </div>
                    </section>

                    <section className="mt-4">
                        <h3
                            id="cover-architecture-heading"
                            className="mb-2 text-xs font-medium text-muted-foreground">
                            {t('coverArchitectureCity')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {ARCHITECTURE_COVERS.map((cover) =>
                                renderCoverOption(cover)
                            )}
                        </div>
                    </section>

                    <section className="mt-4">
                        <h3
                            id="cover-art-heading"
                            className="mb-2 text-xs font-medium text-muted-foreground">
                            {t('coverArtPatterns')}
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {ART_COVERS.map((cover) =>
                                renderCoverOption(cover)
                            )}
                        </div>
                    </section>
                </TabsContent>

                <TabsContent value="upload" className="m-0 p-3">
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            'flex min-h-48 w-full touch-manipulation flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-6 py-8 text-center',
                            'transition-colors hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                            'disabled:cursor-not-allowed disabled:opacity-50'
                        )}>
                        <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-border">
                            {isUploading ? (
                                <LoaderCircle className="size-5 animate-spin motion-reduce:animate-none" />
                            ) : (
                                <UploadCloud className="size-5" />
                            )}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                            {isUploading
                                ? t('uploading')
                                : t('uploadCoverTitle')}
                        </span>
                        <span className="mt-1 text-xs leading-5 text-muted-foreground">
                            {t('uploadCoverDescription')}
                        </span>
                        <span className="mt-3 text-[11px] text-muted-foreground">
                            {t('supportedCoverFormats')}
                        </span>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={(event) => void handleFileChange(event)}
                        className="sr-only"
                        tabIndex={-1}
                    />
                </TabsContent>
            </Tabs>
        </PopoverPanel>
    );
}
