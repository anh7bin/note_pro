'use client';

import { Link } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { BubbleButton } from '../BubbleButton';
import { LinkInput } from '../LinkInput';

interface Props {
    onSubmit: (url: string) => void;
    isActive: boolean;
}

export const LinkControl = memo(function LinkControl({
    onSubmit,
    isActive,
}: Props) {
    const [showLinkInput, setShowLinkInput] = useState(false);

    const handleToggle = useCallback(() => {
        setShowLinkInput(true);
    }, []);

    const handleSubmit = useCallback(
        (url: string) => {
            onSubmit(url);
            setShowLinkInput(false);
        },
        [onSubmit]
    );

    const handleCancel = useCallback(() => {
        setShowLinkInput(false);
    }, []);

    if (showLinkInput) {
        return <LinkInput onSubmit={handleSubmit} onCancel={handleCancel} />;
    }

    return (
        <BubbleButton onClick={handleToggle} isActive={isActive}>
            <Link />
        </BubbleButton>
    );
});
