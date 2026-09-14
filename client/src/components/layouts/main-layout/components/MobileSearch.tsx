import { SearchInputField } from '@/components/features/search';
import { Button } from '@/components/ui/button';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { Search } from 'lucide-react';
import { useState } from 'react';

export const MobileSearch = () => {
    const [open, setOpen] = useState(false);

    return (
        <PopoverPanel
            open={open}
            onOpenChange={setOpen}
            contentProps={{
                align: 'end',
                className: 'w-[calc(100vw-1rem)] p-2 lg:hidden',
            }}
            trigger={
                <Button type="button" variant="ghost" size="icon">
                    <Search />
                </Button>
            }>
            <SearchInputField onResultClick={() => setOpen(false)} />
        </PopoverPanel>
    );
};
