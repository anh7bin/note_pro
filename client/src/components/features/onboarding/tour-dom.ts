export function waitForTarget(selector: string, onReady: () => void) {
    if (document.querySelector(selector)) {
        onReady();
        return () => {};
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            onReady();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
}

export async function revealEditorTarget(
    selector: string,
    placement: 'top' | 'bottom'
) {
    const target = document.querySelector<HTMLElement>(selector);
    const scroller = target?.closest<HTMLElement>(
        '[data-tour="editor-scroll"]'
    );
    if (!target || !scroller) return;

    const targetTop = target.getBoundingClientRect().top;
    const scrollerRect = scroller.getBoundingClientRect();
    const safeTop = scrollerRect.top + (placement === 'top' ? 220 : 120);
    const safeBottom =
        scrollerRect.bottom - (placement === 'bottom' ? 220 : 100);

    if (targetTop < safeTop || targetTop > safeBottom) {
        const desiredTop =
            placement === 'top'
                ? safeTop + 20
                : scrollerRect.top + Math.min(320, scrollerRect.height * 0.36);
        scroller.scrollTop += targetTop - desiredTop;
        await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );
    }
}
