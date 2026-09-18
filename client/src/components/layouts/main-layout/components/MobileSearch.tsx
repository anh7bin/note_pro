import { SearchInputField } from '@/components/features/search';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const MobileSearch = () => {
    const [open, setOpen] = useState(false);
    const { t } = useI18n();

    return (
        <PopoverPanel
            open={open}
            onOpenChange={setOpen}
            contentProps={{
                align: 'end',
                className: 'w-[calc(100vw-1rem)] p-2 lg:hidden',
            }}
            trigger={
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="max-md:size-11"
                    aria-label={t('search')}
                    aria-expanded={open}>
                    <Search aria-hidden="true" />
                </Button>
            }>
            <SearchInputField onResultClick={() => setOpen(false)} />
        </PopoverPanel>
    );
};
