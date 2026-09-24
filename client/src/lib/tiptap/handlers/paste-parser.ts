export interface PastedBlock {
    html: string;
}

const BLOCK_TAGS = new Set([
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'BLOCKQUOTE',
    'DIV',
    'H1',
    'H2',
    'H3',
    'H4',
    'H5',
    'H6',
    'MAIN',
    'OL',
    'P',
    'PRE',
    'SECTION',
    'UL',
]);

const CONTAINER_TAGS = new Set([
    'ADDRESS',
    'ARTICLE',
    'ASIDE',
    'DIV',
    'MAIN',
    'SECTION',
]);

const SKIPPED_TAGS = new Set(['LINK', 'META', 'SCRIPT', 'STYLE']);

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function paragraph(content: string): PastedBlock {
    return { html: `<p>${content}</p>` };
}

export function parsePlainTextBlocks(text: string): PastedBlock[] {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    const blocks: PastedBlock[] = [];

    for (let index = 0; index < lines.length; index += 1) {
        const rawLine = lines[index] ?? '';
        const line = rawLine.trim();
        if (!line) continue;

        const fence = line.match(/^```([\w-]+)?\s*$/);
        if (fence) {
            const codeLines: string[] = [];
            index += 1;
            while (
                index < lines.length &&
                !/^```\s*$/.test(lines[index] ?? '')
            ) {
                codeLines.push(lines[index] ?? '');
                index += 1;
            }
            const languageClass = fence[1]
                ? ` class="language-${escapeHtml(fence[1])}"`
                : '';
            blocks.push({
                html: `<pre><code${languageClass}>${escapeHtml(codeLines.join('\n'))}</code></pre>`,
            });
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            const level = heading[1]?.length ?? 1;
            blocks.push({
                html: `<h${level}>${escapeHtml(heading[2] ?? '')}</h${level}>`,
            });
            continue;
        }

        const bullet = line.match(/^[-*+]\s+(.+)$/);
        if (bullet) {
            blocks.push({
                html: `<ul><li><p>${escapeHtml(bullet[1] ?? '')}</p></li></ul>`,
            });
            continue;
        }

        const ordered = line.match(/^(\d+)[.)]\s+(.+)$/);
        if (ordered) {
            blocks.push({
                html: `<ol start="${ordered[1]}"><li><p>${escapeHtml(ordered[2] ?? '')}</p></li></ol>`,
            });
            continue;
        }

        const quote = line.match(/^>\s?(.+)$/);
        if (quote) {
            blocks.push({
                html: `<blockquote><p>${escapeHtml(quote[1] ?? '')}</p></blockquote>`,
            });
            continue;
        }

        blocks.push(paragraph(escapeHtml(line)));
    }

    return blocks;
}

function splitList(element: Element): PastedBlock[] {
    const listItems = Array.from(element.children).filter(
        (child) => child.tagName === 'LI'
    );
    const parsedStart = Number(element.getAttribute('start') ?? 1);
    const initialStart = Number.isFinite(parsedStart) ? parsedStart : 1;

    return listItems.map((listItem, index) => {
        const wrapper = element.cloneNode(false) as Element;
        if (element.tagName === 'OL') {
            const itemValueAttribute = listItem.getAttribute('value');
            const itemValue =
                itemValueAttribute === null ? null : Number(itemValueAttribute);
            const start =
                itemValue !== null && Number.isFinite(itemValue)
                    ? itemValue
                    : initialStart + index;
            wrapper.setAttribute('start', String(start));
        }
        wrapper.appendChild(listItem.cloneNode(true));
        return { html: wrapper.outerHTML };
    });
}

function parseHtmlBlocks(html: string): PastedBlock[] {
    const container = document.createElement('div');
    container.innerHTML = html;
    const blocks: PastedBlock[] = [];

    const visitChildren = (parent: ParentNode) => {
        const inlineNodes: Node[] = [];
        const flushInlineNodes = () => {
            if (!inlineNodes.length) return;

            const wrapper = document.createElement('p');
            inlineNodes.forEach((node) =>
                wrapper.appendChild(node.cloneNode(true))
            );
            if (wrapper.textContent?.trim()) {
                blocks.push({ html: wrapper.outerHTML });
            }
            inlineNodes.length = 0;
        };

        Array.from(parent.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent?.trim()) inlineNodes.push(node);
                return;
            }
            if (!(node instanceof Element) || SKIPPED_TAGS.has(node.tagName)) {
                return;
            }
            if (!BLOCK_TAGS.has(node.tagName) && node.tagName !== 'BR') {
                inlineNodes.push(node);
                return;
            }

            flushInlineNodes();
            if (node.tagName === 'BR') return;
            if (node.tagName === 'UL' || node.tagName === 'OL') {
                blocks.push(...splitList(node));
                return;
            }
            if (CONTAINER_TAGS.has(node.tagName)) {
                const containsBlocks = Array.from(node.children).some((child) =>
                    BLOCK_TAGS.has(child.tagName)
                );
                if (containsBlocks) {
                    visitChildren(node);
                } else if (node.textContent?.trim()) {
                    blocks.push(paragraph(node.innerHTML));
                }
                return;
            }
            if (node.textContent?.trim() || node.tagName === 'PRE') {
                blocks.push({ html: node.outerHTML });
            }
        });

        flushInlineNodes();
    };

    visitChildren(container);
    return blocks;
}

export function getPastedBlocks(clipboardData: DataTransfer): PastedBlock[] {
    const plainText = clipboardData.getData('text/plain');
    const html = clipboardData.getData('text/html');
    const htmlBlocks = html ? parseHtmlBlocks(html) : [];

    if (htmlBlocks.length > 1) return htmlBlocks;
    return parsePlainTextBlocks(plainText);
}
