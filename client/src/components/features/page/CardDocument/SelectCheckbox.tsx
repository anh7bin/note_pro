import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import React from 'react';

interface SelectCheckboxProps {
    selected: boolean;
    disabled: boolean;
    onToggle: (e: React.MouseEvent) => void;
    selectedClassName: string;
    idleClassName: string;
    className?: string;
}

export const SelectCheckbox = React.memo(function SelectCheckbox({
    selected,
    disabled,
    onToggle,
    selectedClassName,
    idleClassName,
    className,
}: SelectCheckboxProps) {
    const { t } = useI18n();

    return (
        <Button
            variant="ghost"
            size="icon-xs"
            aria-label={selected ? t('deselectDocument') : t('selectDocument')}
            disabled={disabled}
            className={cn(
                'h-5 w-5 rounded-full border focus-visible:opacity-100',
                selected ? selectedClassName : idleClassName,
                className
            )}
            onClick={onToggle}>
            {selected && <Check />}
        </Button>
    );
});
