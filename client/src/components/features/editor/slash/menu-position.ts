export const getPopoverPosition = (coords: {
    top: number;
    bottom: number;
    left: number;
    right: number;
}) => {
    const viewportMargin = 8;
    const menuWidth = 320;
    const maxLeft =
        typeof window === 'undefined'
            ? coords.left
            : Math.max(
                  viewportMargin,
                  window.innerWidth - menuWidth - viewportMargin
              );

    return {
        top: coords.bottom,
        left: Math.max(viewportMargin, Math.min(coords.left, maxLeft)),
    };
};

export const shouldShowSlash = (textBefore: string, suffixes: string[]) =>
    suffixes.some((suffix) =>
        suffix === '' ? textBefore.length === 0 : textBefore.endsWith(suffix)
    );
