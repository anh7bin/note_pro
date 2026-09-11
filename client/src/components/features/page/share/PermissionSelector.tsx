'use client';

import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { Check, ChevronsUpDown, Eye, LockKeyhole, Pencil } from 'lucide-react';
import { PermissionType } from '@/types/types';
import { useState } from 'react';

export type LinkPermissionType =
    | 'restricted'
    | PermissionType.READ
    | PermissionType.WRITE;

const permissionOptions = [
    {
        value: 'restricted',
        label: 'Only collaborators with access',
        icon: LockKeyhole,
        description: 'Only invited people can open this document.',
    },
    {
        value: PermissionType.READ,
        label: 'Anyone with the link can view',
        icon: Eye,
        description: 'People with the link can read the document.',
    },
    {
        value: PermissionType.WRITE,
        label: 'Anyone with the link can edit',
        icon: Pencil,
        description: 'People with the link can make changes.',
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
                    variant="outline"
                    aria-expanded={isOpen}
                    disabled={disabled}
                    className="min-w-0 flex-1 justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {selectedOption && (
                            <selectedOption.icon className="h-4 w-4" />
                        )}
                        <span className="truncate">
                            {selectedOption?.label}
                        </span>
                    </div>
                    <ChevronsUpDown className="opacity-50" aria-hidden="true" />
                </Button>
            }>
            {permissionOptions.map((option) => (
                <button
                    type="button"
                    aria-pressed={value === option.value}
                    key={option.value}
                    onClick={() => {
                        onChange(option.value as LinkPermissionType);
                        setIsOpen(false);
                    }}
                    className="flex min-h-11 w-full items-start gap-3 rounded-md p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
                    <option.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {option.label}
                            </span>
                            {value === option.value && (
                                <Check className="h-4 w-4" aria-hidden="true" />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {option.description}
                        </p>
                    </div>
                </button>
            ))}
            <div className="border-t border-border mt-2 pt-2 px-3 pb-2">
                <p className="text-xs text-muted-foreground">
                    Choose whether the link is restricted or grants view or edit
                    access.
                </p>
            </div>
        </PopoverPanel>
    );
}
