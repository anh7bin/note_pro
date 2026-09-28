'use client';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import { Button } from '@/components/ui/button';
import { InputField } from '@/components/ui/input-field';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Modal } from '@/components/ui/modal';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeProvider';
import {
    UpdateWorkspaceDocument,
    type UpdateWorkspaceMutation,
    type UpdateWorkspaceMutationVariables,
} from '@/graphql/mutations/__generated__/workspace.generated';
import { useDebounce } from '@/hooks';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useWorkspace } from '@/hooks/useWorkspace';
import { DEFAULT_WORKSPACE_IMAGE } from '@/lib/constants';
import showToast from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useApolloClient } from '@apollo/client';
import { Camera, Settings } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AccentColorPicker } from './AccentColorPicker';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface WorkspaceSnapshot {
    name: string;
    imageUrl: string | null;
}

export const WorkspaceButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const initializedSessionRef = useRef(false);
    const desiredWorkspaceRef = useRef<WorkspaceSnapshot>({
        name: '',
        imageUrl: null,
    });
    const persistedWorkspaceRef = useRef<WorkspaceSnapshot>({
        name: '',
        imageUrl: null,
    });
    const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
    const { t } = useI18n();
    const { accentColor, setAccentColor } = useTheme();
    const { debounced, flush, cancel } = useDebounce(300);
    const apolloClient = useApolloClient();

    const { workspace, refetch } = useWorkspace();

    const workspaceImage = workspace?.image_url || DEFAULT_WORKSPACE_IMAGE;
    const workspaceName = workspace?.name || '';

    const { uploadImage, isUploading } = useImageUpload({
        tags: ['workspace', workspace?.id || ''],
    });

    const requestWorkspaceSave = useCallback(() => {
        if (!workspace?.id) return;

        const snapshot: WorkspaceSnapshot = {
            name: desiredWorkspaceRef.current.name.trim(),
            imageUrl: desiredWorkspaceRef.current.imageUrl,
        };

        if (!snapshot.name) return;

        setSaveStatus('saving');
        let succeeded = true;

        const pendingSave = saveQueueRef.current
            .catch(() => undefined)
            .then(async () => {
                const persisted = persistedWorkspaceRef.current;
                if (
                    snapshot.name === persisted.name &&
                    snapshot.imageUrl === persisted.imageUrl
                ) {
                    return;
                }

                try {
                    const result = await apolloClient.mutate<
                        UpdateWorkspaceMutation,
                        UpdateWorkspaceMutationVariables
                    >({
                        mutation: UpdateWorkspaceDocument,
                        variables: {
                            workspaceId: workspace.id,
                            name: snapshot.name,
                            imageUrl: snapshot.imageUrl,
                        },
                    });

                    if (!result.data?.update_workspaces_by_pk) {
                        throw new Error('Workspace update returned no data');
                    }

                    persistedWorkspaceRef.current = snapshot;
                    await refetch();
                } catch (error) {
                    succeeded = false;
                    console.error('Failed to update workspace:', error);
                    showToast.error(t('workspaceUpdateError'));
                }
            });

        saveQueueRef.current = pendingSave;
        void pendingSave.finally(() => {
            if (saveQueueRef.current === pendingSave) {
                setSaveStatus(succeeded ? 'saved' : 'error');
            }
        });
    }, [apolloClient, refetch, t, workspace?.id]);

    useEffect(() => {
        if (!isOpen) {
            initializedSessionRef.current = false;
            return;
        }

        if (!workspace || initializedSessionRef.current) return;

        const snapshot = {
            name: workspace.name || '',
            imageUrl: workspace.image_url || null,
        };
        setTempName(snapshot.name);
        setTempImageUrl(snapshot.imageUrl);
        setSaveStatus('idle');
        desiredWorkspaceRef.current = snapshot;
        persistedWorkspaceRef.current = snapshot;
        initializedSessionRef.current = true;
    }, [isOpen, workspace]);

    useEffect(() => () => cancel('workspace-name'), [cancel]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            if (desiredWorkspaceRef.current.name.trim()) {
                flush();
            } else {
                cancel('workspace-name');
            }
        }
        setIsOpen(open);
    };

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = await uploadImage(file);
            event.target.value = '';

            if (imageUrl) {
                setTempImageUrl(imageUrl);
                desiredWorkspaceRef.current.imageUrl = imageUrl;
                requestWorkspaceSave();
            }
        }
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setTempName(name);
        desiredWorkspaceRef.current.name = name;

        if (name.trim()) {
            setSaveStatus('saving');
            debounced(requestWorkspaceSave, 'workspace-name');
        } else {
            cancel('workspace-name');
            setSaveStatus('idle');
        }
    };

    const isNameInvalid =
        isOpen && initializedSessionRef.current && !tempName.trim();

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
            title={t('workspaceSettings')}
            description={t('workspaceSettingsDescription')}
            trigger={
                <Button
                    size="sm"
                    variant="ghost"
                    className="group gap-2 px-1.5 text-xs rounded-lg">
                    <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded">
                        <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group-hover:scale-75 group-hover:opacity-0 group-focus-visible:scale-75 group-focus-visible:opacity-0">
                            <Image
                                src={workspaceImage}
                                alt={t('workspace')}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 flex scale-75 items-center justify-center opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                            <Settings className="text-foreground" />
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
            <div className="space-y-3">
                <div>
                    <div className="flex items-center justify-center">
                        <div className="group relative">
                            <button
                                type="button"
                                className={cn(
                                    'relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2',
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
                                    alt={t('workspace')}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                disabled={isUploading}
                                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-background shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50">
                                <Camera className="w-3.5 h-3.5 text-foreground" />
                            </button>
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

                <div className="space-y-1.5">
                    <label
                        htmlFor="workspace-name"
                        className="text-sm font-medium">
                        {t('workspaceName')}
                    </label>
                    <InputField
                        id="workspace-name"
                        value={tempName}
                        onChange={handleNameChange}
                        placeholder={t('workspaceNamePlaceholder')}
                    />
                    <p
                        id="workspace-name-feedback"
                        role={isNameInvalid ? 'alert' : 'status'}
                        className={cn(
                            'min-h-4 text-xs',
                            isNameInvalid
                                ? 'text-destructive'
                                : saveStatus === 'error'
                                  ? 'text-destructive'
                                  : 'text-muted-foreground'
                        )}>
                        {isNameInvalid
                            ? t('workspaceNameRequired')
                            : saveStatus === 'saving'
                              ? t('saving')
                              : saveStatus === 'saved'
                                ? t('workspaceSaved')
                                : saveStatus === 'error'
                                  ? t('workspaceUpdateError')
                                  : ''}
                    </p>
                </div>

                <AccentColorPicker
                    value={accentColor}
                    onChange={setAccentColor}
                />
            </div>
            <LoadingOverlay open={isUploading} text={t('uploading')} />
        </Modal>
    );
};
