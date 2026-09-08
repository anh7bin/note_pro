'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
    onSubmit: (url: string) => void;
    onCancel: () => void;
}

export const LinkInput = ({ onSubmit, onCancel }: Props) => {
    const [url, setUrl] = useState('');

    return (
        <form
            className="flex items-center gap-1"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit(url);
            }}>
            <Input
                type="url"
                aria-label="Link URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://"
                className="h-8 w-52 text-sm"
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onCancel();
                    }
                }}
            />
            <Button type="submit" size="sm" className="h-8 px-2">
                OK
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Cancel link editing"
                onClick={onCancel}>
                <X />
            </Button>
        </form>
    );
};
