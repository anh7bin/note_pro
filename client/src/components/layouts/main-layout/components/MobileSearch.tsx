import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { SearchInputField } from '@/components/features/search';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const MobileSearch = () => {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);

    return (
        <PopoverPanel
            open={open}
            onOpenChange={setOpen}
            contentProps={{
                align: 'start',
                sideOffset: 8,
                collisionPadding: 12,
                className:
                    'w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl p-0 shadow-md sm:w-96 lg:hidden',
            }}
            trigger={
                <SimpleTooltip title={t('search')}>
                    <Button variant="ghost" size="icon-xs">
                        <Search />
                    </Button>
                </SimpleTooltip>
            }>
            <SearchInputField
                embedded
                autoFocus
                onResultClick={() => setOpen(false)}
            />
        </PopoverPanel>
    );
};
