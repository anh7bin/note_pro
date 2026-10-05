import { cn } from '@/lib/utils';
import { NewDocumentIcon } from './icons/NewDocumentIcon';

interface DocumentListIconProps {
    icon?: unknown;
    className?: string;
}

export function DocumentListIcon({ icon, className }: DocumentListIconProps) {
    const documentEmoji = typeof icon === 'string' && icon.trim() ? icon : null;

    return (
        <span
            className={cn(
                'flex size-5 shrink-0 items-center justify-center overflow-visible leading-none',
                className
            )}>
            {documentEmoji ? (
                <span className="block text-[15px] leading-none">
                    {documentEmoji}
                </span>
            ) : (
                <NewDocumentIcon size={24} className="max-w-none shrink-0" />
            )}
        </span>
    );
}
