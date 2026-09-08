import { Button } from '@/components/ui/button';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface ContextDropdownMenuProps {
    children?: React.ReactNode;
    menuContent: React.ReactNode;
    align?: 'start' | 'center' | 'end';
}

export const ContextDropdownMenu = ({
    children,
    menuContent,
    align = 'start',
}: ContextDropdownMenuProps) => {
    if (children) {
        return (
            <ContextMenu modal={false}>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                    {menuContent}
                </ContextMenuContent>
            </ContextMenu>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open item actions"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align={align}>
                {menuContent}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
