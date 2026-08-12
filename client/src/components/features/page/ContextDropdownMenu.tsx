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
import { CgMoreO } from 'react-icons/cg';

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
                <ContextMenuContent className="w-44 p-2 rounded-md">
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
                    className="w-6 h-6 group-hover:opacity-100 opacity-0 transition-opacity"
                    onClick={(e) => e.stopPropagation()}>
                    <CgMoreO size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 p-2 rounded-md" align={align}>
                {menuContent}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
