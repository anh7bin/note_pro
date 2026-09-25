import { Block } from '@/hooks';
import { cn } from '@/lib/utils';
import type { SeparatorStyle } from '@/components/features/blocks';

const separatorClasses: Record<SeparatorStyle, string> = {
    strong: 'border-t-[3px] border-solid border-foreground/80',
    regular: 'border-t-[2px] border-solid border-foreground/60',
    light: 'border-t border-solid border-border-strong',
    extralight: 'border-t border-dotted border-border',
};

export const SeparatorPreview = ({ block }: { block: Block }) => {
    const style = (block.content?.style as SeparatorStyle) || 'regular';

    return <div className={cn('w-full my-1', separatorClasses[style])} />;
};
