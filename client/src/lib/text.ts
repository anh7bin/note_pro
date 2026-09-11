export function getPlainText(html?: string | null): string {
    if (!html) return '';

    if (typeof DOMParser !== 'undefined') {
        const document = new DOMParser().parseFromString(html, 'text/html');
        return document.body.textContent || '';
    }

    return html.replace(/<[^>]*>/g, '');
}
