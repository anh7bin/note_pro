'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useSidebar } from 'contexts/SidebarContext';
import { useEffect } from 'react';
import { PiSidebar } from 'react-icons/pi';

export function SidebarToggleButton() {
    const { toggle } = useSidebar();
    const { t } = useI18n();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggle]);

    return (
        <SimpleTooltip title={t('toggleSidebar')}>
            <Button type="button" variant="ghost" size="icon" onClick={toggle}>
                <PiSidebar />
            </Button>
        </SimpleTooltip>
    );
}
