export type DocumentListSortKey = 'name' | 'updatedAt' | 'createdAt';

export type DocumentListSort = {
    key: DocumentListSortKey;
    direction: 'asc' | 'desc';
};

export function nextDocumentListSort(
    current: DocumentListSort | null,
    key: DocumentListSortKey
): DocumentListSort {
    if (current?.key === key) {
        return {
            key,
            direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
    }

    return { key, direction: key === 'name' ? 'asc' : 'desc' };
}

export function sortDocumentListItems<T>(
    items: T[],
    sort: DocumentListSort | null,
    getValue: (item: T, key: DocumentListSortKey) => string | null | undefined,
    locale: string
): T[] {
    if (!sort) return items;

    const collator = new Intl.Collator(locale, {
        numeric: true,
        sensitivity: 'base',
    });
    const rows = items.map((item, index) => {
        const value = getValue(item, sort.key);
        return {
            item,
            index,
            value:
                sort.key === 'name'
                    ? (value ?? '')
                    : value
                      ? Date.parse(value)
                      : null,
        };
    });

    rows.sort((a, b) => {
        const aMissing = a.value === null || Number.isNaN(a.value);
        const bMissing = b.value === null || Number.isNaN(b.value);

        if (aMissing !== bMissing) return aMissing ? 1 : -1;
        if (aMissing) return a.index - b.index;

        const comparison =
            sort.key === 'name'
                ? collator.compare(a.value as string, b.value as string)
                : (a.value as number) - (b.value as number);

        return comparison === 0
            ? a.index - b.index
            : comparison * (sort.direction === 'asc' ? 1 : -1);
    });

    return rows.map(({ item }) => item);
}
