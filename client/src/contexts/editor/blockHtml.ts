const MERGEABLE_TEXT_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

function canMergeTextElements(
    previousElement: Element,
    currentElement: Element
): boolean {
    return (
        MERGEABLE_TEXT_TAGS.has(previousElement.tagName) &&
        MERGEABLE_TEXT_TAGS.has(currentElement.tagName)
    );
}

function canMergeListElements(
    previousElement: Element,
    currentElement: Element
): boolean {
    return (
        previousElement.tagName === currentElement.tagName &&
        (previousElement.tagName === 'UL' || previousElement.tagName === 'OL')
    );
}

export function mergeBlockHtml(
    previousHtml: string,
    currentHtml: string
): string {
    const previousContainer = document.createElement('div');
    const currentContainer = document.createElement('div');
    previousContainer.innerHTML = previousHtml;
    currentContainer.innerHTML = currentHtml;

    const previousElement = previousContainer.lastElementChild;
    const currentElement = currentContainer.firstElementChild;

    if (!previousElement) return currentHtml;
    if (!currentElement) return previousHtml;

    if (
        canMergeTextElements(previousElement, currentElement) ||
        canMergeListElements(previousElement, currentElement)
    ) {
        while (currentElement.firstChild) {
            previousElement.appendChild(currentElement.firstChild);
        }
        currentElement.remove();
    }

    return previousContainer.innerHTML + currentContainer.innerHTML;
}
