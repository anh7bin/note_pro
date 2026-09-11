'use client';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { Modal } from '@/components/ui/modal';
import { useUpdateWorkspaceMutation } from '@/graphql/mutations/__generated__/workspace.generated';
import { useGetWorkspaceByIdQuery } from '@/graphql/queries/__generated__/workspace.generated';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useWorkspace } from '@/hooks/useWorkspace';
import { DEFAULT_WORKSPACE_IMAGE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import showToast from '@/lib/toast';
import { Camera, Settings, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const WorkspaceButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(
        null
    );
    const [hasImageChanged, setHasImageChanged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [updateWorkspace] = useUpdateWorkspaceMutation();
    const { workspace } = useWorkspace();

    const { data, refetch } = useGetWorkspaceByIdQuery({
        variables: { id: workspace?.id || '' },
        skip: !workspace?.id,
    });

    const displayWorkspace = data?.workspaces_by_pk ?? workspace;
    const workspaceImage =
        displayWorkspace?.image_url || DEFAULT_WORKSPACE_IMAGE;
    const workspaceName = displayWorkspace?.name || '';

    const { uploadImage, isUploading } = useImageUpload({
        tags: ['workspace', workspace?.id || ''],
        onSuccess: (imageUrl) => {
            setTempImageUrl(imageUrl);
            setHasImageChanged(true);
        },
    });

    useEffect(() => {
        if (isOpen && data?.workspaces_by_pk) {
            const dbImageUrl = data.workspaces_by_pk.image_url || null;
            setTempName(data.workspaces_by_pk.name || '');
            setTempImageUrl(dbImageUrl);
            setOriginalImageUrl(dbImageUrl);
            setHasImageChanged(false);
        } else if (!isOpen) {
            setTempName('');
            setTempImageUrl(null);
            setOriginalImageUrl(null);
            setHasImageChanged(false);
        }
    }, [isOpen, data]);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            await uploadImage(file);
        }
    };

    const handleRemoveImage = () => {
        setTempImageUrl(originalImageUrl);
        setHasImageChanged(
            originalImageUrl !== data?.workspaces_by_pk?.image_url
        );
    };

    const handleSave = async () => {
        try {
            const nameChanged =
                tempName.trim() && tempName !== data?.workspaces_by_pk?.name;

            if (!nameChanged && !hasImageChanged) {
                setIsOpen(false);
                return;
            }

            setIsSaving(true);
            await updateWorkspace({
                variables: {
                    workspaceId: workspace?.id || '',
                    name: nameChanged
                        ? tempName.trim()
                        : data?.workspaces_by_pk?.name,
                    imageUrl: hasImageChanged
                        ? tempImageUrl
                        : data?.workspaces_by_pk?.image_url,
                },
            });

            await refetch();
            setIsOpen(false);
            showToast.success('Workspace updated successfully');
        } catch (error) {
            showToast.error('Error updating workspace', {
                description:
                    error instanceof Error ? error.message : 'Unknown error',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={setIsOpen}
            title="Workspace settings"
            description="Update the workspace name and image shown to members."
            contentProps={{
                className: 'max-h-[90vh] overflow-y-auto sm:max-w-[500px]',
            }}
            footer={
                <Button
                    onClick={handleSave}
                    className="w-full sm:w-auto"
                    disabled={
                        isUploading ||
                        isSaving ||
                        !tempName.trim() ||
                        (tempName === data?.workspaces_by_pk?.name &&
                            !hasImageChanged)
                    }>
                    {isUploading
                        ? 'Uploading...'
                        : isSaving
                          ? 'Saving...'
                          : 'Save changes'}
                </Button>
            }
            trigger={
                <Button
                    variant="ghost"
                    className="group h-9 w-full cursor-pointer justify-start gap-2 px-2 text-xs">
                    <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded">
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:scale-75 group-hover:opacity-0 group-focus-visible:scale-75 group-focus-visible:opacity-0">
                            <Image
                                src={workspaceImage}
                                alt="Workspace"
                                fill
                                className="object-cover"
                                sizes="20px"
                            />
                        </div>
                        <div className="absolute inset-0 flex scale-75 items-center justify-center opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                            <Settings className="h-4 w-4 text-foreground" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1 min-w-0 flex-1">
                        <TruncatedTooltip text={workspaceName}>
                            <span className="truncate font-bold">
                                {workspaceName}
                            </span>
                        </TruncatedTooltip>
                    </div>
                </Button>
            }>
            <div className="space-y-6 py-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-center">
                        <div className="group relative">
                            <button
                                type="button"
                                aria-label="Change workspace image"
                                className={cn(
                                    'relative h-24 w-24 cursor-pointer overflow-hidden rounded-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
                                    tempImageUrl ? 'bg-muted' : 'bg-muted/50'
                                )}
                                onClick={() =>
                                    !isUploading &&
                                    fileInputRef.current?.click()
                                }>
                                <Image
                                    src={
                                        tempImageUrl
                                            ? tempImageUrl
                                            : DEFAULT_WORKSPACE_IMAGE
                                    }
                                    alt="Workspace"
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                disabled={isUploading}
                                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-background shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
                                aria-label={
                                    tempImageUrl
                                        ? 'Change image'
                                        : 'Upload image'
                                }>
                                <Camera className="w-3.5 h-3.5 text-foreground" />
                            </button>

                            {hasImageChanged &&
                                tempImageUrl !== originalImageUrl &&
                                !isUploading && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-100 shadow-md transition-all hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                                        aria-label="Restore original workspace image">
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="workspace-name"
                        className="text-sm font-medium">
                        Workspace Name
                    </label>
                    <InputField
                        id="workspace-name"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="My Workspace"
                    />
                </div>
            </div>
        </Modal>
    );
};
