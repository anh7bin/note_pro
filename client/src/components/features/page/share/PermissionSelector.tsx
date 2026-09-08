'use client';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Eye, Pencil } from 'lucide-react';
import { PermissionType } from '@/types/types';
import { useState } from 'react';

type LinkPermissionType = PermissionType.READ | PermissionType.WRITE;

const permissionOptions = [
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
}

export function PermissionSelector({
    value,
    onChange,
}: PermissionSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = permissionOptions.find((opt) => opt.value === value);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    aria-expanded={isOpen}
                    className="flex-1 justify-between text-sm">
                    <div className="flex items-center gap-2">
                        {selectedOption && (
                            <selectedOption.icon className="h-4 w-4" />
                        )}
                        <span>{selectedOption?.label}</span>
                    </div>
                    <ChevronsUpDown className="opacity-50" aria-hidden="true" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[min(400px,calc(100vw-2rem))] p-2"
                align="start">
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
                                    <Check
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
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
                        Set your link to &ldquo;view&rdquo; or
                        &ldquo;edit&rdquo; for easy collaboration, no Craft
                        account needed.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
