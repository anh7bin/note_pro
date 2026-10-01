import React from 'react';

const FADE_BASE =
    'pointer-events-none absolute inset-x-0 h-16 from-background to-transparent';

export const ScrollFades = React.memo(function ScrollFades({
    isScrollable,
    scrolled,
    atBottom,
}: {
    isScrollable: boolean;
    scrolled: boolean;
    atBottom: boolean;
}) {
    if (!isScrollable) {
        return null;
    }

    return (
        <>
            {scrolled && (
                <div
                    aria-hidden="true"
                    className={`${FADE_BASE} top-0 bg-gradient-to-b`}
                />
            )}
            {!atBottom && (
                <div
                    aria-hidden="true"
                    className={`${FADE_BASE} bottom-0 bg-gradient-to-t`}
                />
            )}
        </>
    );
});
