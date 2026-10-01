import { useCallback, useState } from 'react';
import { FADE_BOTTOM_THRESHOLD, FADE_TOP_THRESHOLD } from './constants';

interface FadeState {
    scrolled: boolean;
    atBottom: boolean;
}

export function useScrollFades() {
    const [state, setState] = useState<FadeState>({
        scrolled: false,
        atBottom: false,
    });

    const onScroll = useCallback(
        (scrollOffset: number, height: number, totalHeight: number) => {
            const scrolled = scrollOffset > FADE_TOP_THRESHOLD;
            const atBottom =
                scrollOffset + height >= totalHeight - FADE_BOTTOM_THRESHOLD;

            setState((prev) =>
                prev.scrolled === scrolled && prev.atBottom === atBottom
                    ? prev
                    : { scrolled, atBottom }
            );
        },
        []
    );

    return { ...state, onScroll };
}
