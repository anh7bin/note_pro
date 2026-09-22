'use client';

import { createContext, useCallback, useContext } from 'react';
import { useCurrentUserLocalStorage } from '@/hooks';

const SidebarContext = createContext<{
    isOpen: boolean | undefined;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}>({
    isOpen: true,
    toggle: () => {},
    setOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useCurrentUserLocalStorage<boolean>(
        'sidebar_open',
        true
    );

    const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);
    const setOpen = useCallback(
        (open: boolean) => setIsOpen(open),
        [setIsOpen]
    );

    return (
        <SidebarContext.Provider value={{ isOpen, toggle, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
