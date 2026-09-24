'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useCurrentUserLocalStorage } from '@/hooks';

const SidebarContext = createContext<{
    isOpen: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}>({
    isOpen: true,
    toggle: () => {},
    setOpen: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [desktopOpen, setDesktopOpen] = useCurrentUserLocalStorage<boolean>(
        'sidebar_open',
        true
    );
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(max-width: 767px)').matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        const updateViewport = (event: MediaQueryListEvent) =>
            setIsMobile(event.matches);

        setIsMobile(mediaQuery.matches);
        mediaQuery.addEventListener('change', updateViewport);
        return () => mediaQuery.removeEventListener('change', updateViewport);
    }, []);

    const isOpen = isMobile ? mobileOpen : (desktopOpen ?? true);

    const toggle = useCallback(() => {
        if (isMobile) {
            setMobileOpen((open) => !open);
            return;
        }

        setDesktopOpen((open) => !(open ?? true));
    }, [isMobile, setDesktopOpen]);
    const setOpen = useCallback(
        (open: boolean) => {
            if (isMobile) {
                setMobileOpen(open);
                return;
            }

            setDesktopOpen(open);
        },
        [isMobile, setDesktopOpen]
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
