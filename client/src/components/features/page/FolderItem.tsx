import { SidebarButton } from '@/components/layouts/main-layout/components/SidebarButton';
import { FolderNode } from '@/lib/folder';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { FolderMoreMenu } from './FolderMoreMenu';

const hasActiveDescendant = (
    folder: FolderNode,
    pathname: string,
    workspaceSlug: string | null
): boolean => {
    if (!workspaceSlug) return false;

    const currentHref = ROUTES.WORKSPACE_FOLDER(workspaceSlug, folder.id);
    if (pathname === currentHref) return true;

    if (folder.children && folder.children.length > 0) {
        return folder.children.some((child) =>
            hasActiveDescendant(child, pathname, workspaceSlug)
        );
    }

    return false;
};

export const FolderItem: React.FC<{
    folder: FolderNode;
    workspaceSlug: string | null;
    shouldExpandAll?: boolean;
}> = ({ folder, workspaceSlug, shouldExpandAll }) => {
    const pathname = usePathname();
    const hasChildren = folder.children && folder.children.length > 0;

    const shouldAutoExpand =
        hasChildren && hasActiveDescendant(folder, pathname, workspaceSlug);

    const [expanded, setExpanded] = useState(shouldAutoExpand);
    const [isHovered, setIsHovered] = useState(false);
    const [hasBeenManuallyToggled, setHasBeenManuallyToggled] = useState(false);

    useEffect(() => {
        if (shouldAutoExpand) {
            setExpanded(true);
        }
    }, [shouldAutoExpand]);

    useEffect(() => {
        if (shouldExpandAll && !hasBeenManuallyToggled) {
            setExpanded(true);
        }
    }, [shouldExpandAll, hasBeenManuallyToggled]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasChildren) {
            setExpanded(!expanded);
            setHasBeenManuallyToggled(true);
        }
    };

    const href = workspaceSlug
        ? ROUTES.WORKSPACE_FOLDER(workspaceSlug, folder.id)
        : undefined;

    return (
        <div className="flex flex-col gap-1">
            <FolderMoreMenu folder={folder}>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}>
                    <SidebarButton
                        className="min-w-0"
                        label={folder.name}
                        icon={
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                <div
                                    className={cn(
                                        'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                        hasChildren && isHovered
                                            ? 'opacity-0 scale-75'
                                            : 'opacity-100 scale-100'
                                    )}>
                                    <span className="text-base leading-none">
                                        {folder.icon}
                                    </span>
                                </div>
                                {hasChildren && (
                                    <button
                                        onClick={handleToggle}
                                        className={cn(
                                            'absolute inset-0 flex items-center justify-center transition-all duration-200',
                                            isHovered
                                                ? 'opacity-100 scale-100'
                                                : 'opacity-0 scale-75 pointer-events-none'
                                        )}>
                                        <FiChevronRight
                                            className={cn(
                                                'w-4 h-4 transition-transform duration-200',
                                                expanded
                                                    ? 'rotate-0'
                                                    : 'rotate-90'
                                            )}
                                        />
                                    </button>
                                )}
                            </div>
                        }
                        href={href}
                        isActive={href ? pathname === href : false}
                    />
                </div>
            </FolderMoreMenu>
            {expanded && hasChildren && (
                <div className="ml-3 border-l border-border pl-2">
                    {folder.children!.map((child) => (
                        <FolderItem
                            key={child.id}
                            folder={child}
                            workspaceSlug={workspaceSlug}
                            shouldExpandAll={expanded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
