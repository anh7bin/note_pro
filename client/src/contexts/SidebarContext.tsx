'use client';

import { createContext, useCallback, useContext } from 'react';
import { useCurrentUserLocalStorage } from '@/hooks';

const SidebarContext = createContext<{
    isOpen: boolean | undefined;
    toggle: () => void;
}>({
    isOpen: true,
    toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useCurrentUserLocalStorage<boolean>(
        'sidebar_open',
        true
    );

    const toggle = useCallback(() => setIsOpen((prev) => !prev), [setIsOpen]);

    return (
        <SidebarContext.Provider value={{ isOpen, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}
