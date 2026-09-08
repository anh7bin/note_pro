import { useSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';
import React from 'react';

interface LayoutEditorProps {
    left?: React.ReactNode;
    children?: React.ReactNode;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
    left,
    children,
}) => {
    const { isOpen, toggle } = useSidebar();

    return (
        <div className="flex h-full min-h-0 w-full flex-row">
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close document sidebar"
                    className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 bg-black/35 md:hidden"
                    onClick={toggle}
                />
            )}
            <div
                aria-hidden={!isOpen}
                className={cn(
                    'fixed bottom-0 left-0 top-[var(--header-height)] z-40 w-[var(--sidebar-width)] flex-shrink-0 overflow-hidden border-r border-border-subtle bg-background shadow-md transition-[transform,width,visibility] duration-300 md:static md:h-full md:shadow-none',
                    isOpen
                        ? 'visible translate-x-0 md:w-[var(--sidebar-width)]'
                        : 'invisible -translate-x-full pointer-events-none md:w-0'
                )}>
                {left}
            </div>
            <div
                className={`min-w-0 flex-1 ${isOpen ? 'overflow-hidden border-l' : ''}`}>
                {children}
            </div>
        </div>
    );
};
