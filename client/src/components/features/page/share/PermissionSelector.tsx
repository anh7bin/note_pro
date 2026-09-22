'use client';

import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { PermissionType } from '@/types/types';
import { Check, ChevronsUpDown, Eye, LockKeyhole, Pencil } from 'lucide-react';
import { useState } from 'react';

export type LinkPermissionType =
    | 'restricted'
    | PermissionType.READ
    | PermissionType.WRITE;

const permissionOptions = [
    {
        value: 'restricted',
        labelKey: 'restrictedAccess' as const,
        icon: LockKeyhole,
        descriptionKey: 'restrictedAccessDescription' as const,
    },
    {
        value: PermissionType.READ,
        labelKey: 'anyoneCanView' as const,
        icon: Eye,
        descriptionKey: 'anyoneCanViewDescription' as const,
    },
    {
        value: PermissionType.WRITE,
        labelKey: 'anyoneCanEdit' as const,
        icon: Pencil,
        descriptionKey: 'anyoneCanEditDescription' as const,
    },
];

interface PermissionSelectorProps {
    value: LinkPermissionType;
    onChange: (value: LinkPermissionType) => void;
    disabled?: boolean;
}

export function PermissionSelector({
    value,
    onChange,
    disabled = false,
}: PermissionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useI18n();
    const selectedOption = permissionOptions.find((opt) => opt.value === value);

    return (
        <PopoverPanel
            open={isOpen}
            onOpenChange={setIsOpen}
            contentProps={{
                align: 'start',
                className: 'w-[min(400px,calc(100vw-2rem))] p-2',
            }}
            trigger={
                <Button
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    className="w-full min-w-0 justify-between overflow-hidden px-3 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                        {selectedOption && (
                            <selectedOption.icon className="h-4 w-4" />
                        )}
                        <span className="truncate text-left">
                            {selectedOption && t(selectedOption.labelKey)}
                        </span>
                    </div>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            }>
            {permissionOptions.map((option) => (
                <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                        onChange(option.value as LinkPermissionType);
                        setIsOpen(false);
                    }}
                    className="flex min-h-10 w-full items-start gap-2 rounded-md p-1.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
                    <option.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {t(option.labelKey)}
                            </span>
                            {value === option.value && (
                                <Check className="h-4 w-4" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {t(option.descriptionKey)}
                        </p>
                    </div>
                </button>
            ))}
            <div className="border-t border-border mt-2 pt-2">
                <p className="text-xs text-muted-foreground">
                    {t('permissionHelp')}
                </p>
            </div>
        </PopoverPanel>
    );
}
