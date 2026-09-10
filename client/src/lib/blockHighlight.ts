/**
 * Highlights a block element with a border and background effect
 * Returns a cleanup function to remove the highlight
 */
export const highlightBlock = (blockId: string): (() => void) | null => {
    const el = document.querySelector<HTMLElement>(
        `[data-block-id="${blockId}"]`
    );
    if (!el) {
        return null;
    }

    const scrollContainer = el.closest('.overflow-y-auto');

    if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect();
        const blockRect = el.getBoundingClientRect();
        const headerOffset = 100;

        const isInViewport =
            blockRect.top >= containerRect.top + headerOffset &&
            blockRect.bottom <= containerRect.bottom - 50;

        if (!isInViewport) {
            const scrollTop = scrollContainer.scrollTop;
            const blockOffsetTop =
                blockRect.top - containerRect.top + scrollTop;

            scrollContainer.scrollTo({
                top: blockOffsetTop - headerOffset,
                behavior: 'smooth',
            });
        }
    }

    const originalBackgroundColor = el.style.backgroundColor;
    const originalBoxShadow = el.style.boxShadow;

    el.style.backgroundColor = 'hsl(var(--button-primary) / 0.08)';
    el.style.boxShadow = 'inset 0 0 0 1px hsl(var(--button-primary) / 0.28)';

    const handleClickOutside = (event: MouseEvent) => {
        if (!el.contains(event.target as Node)) {
            cleanup();
        }
    };

    const cleanup = () => {
        el.style.backgroundColor = originalBackgroundColor;
        el.style.boxShadow = originalBoxShadow;
        document.removeEventListener('click', handleClickOutside);
    };

    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);

    return cleanup;
};
