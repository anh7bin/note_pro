'use client';

import { useEffect, useState } from 'react';

export type DocumentView = 'card' | 'list';

const STORAGE_KEY = 'document-view';

export function useDocumentView() {
    const [view, setView] = useState<DocumentView>('card');

    useEffect(() => {
        if (window.localStorage.getItem(STORAGE_KEY) === 'list') {
            setView('list');
        }
    }, []);

    const changeView = (nextView: DocumentView) => {
        setView(nextView);
        window.localStorage.setItem(STORAGE_KEY, nextView);
    };

    return { view, changeView };
}
