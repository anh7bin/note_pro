'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface DocumentSelectionContextType {
    selectedDocuments: Set<string>;
    toggleDocument: (id: string) => void;
    clearSelection: () => void;
    selectAll: (documentIds: string[]) => void;
    isSelected: (id: string) => boolean;
    mode: 'default' | 'shared';
    setMode: (mode: 'default' | 'shared') => void;
}

const DocumentSelectionContext = createContext<
    DocumentSelectionContextType | undefined
>(undefined);

export function DocumentSelectionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(
        new Set()
    );
    const [mode, setMode] = useState<'default' | 'shared'>('default');

    const toggleDocument = useCallback((id: string) => {
        setSelectedDocuments((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedDocuments(new Set());
    }, []);

    const selectAll = useCallback((documentIds: string[]) => {
        setSelectedDocuments(new Set(documentIds));
    }, []);

    const isSelected = (id: string) => selectedDocuments.has(id);

    return (
        <DocumentSelectionContext.Provider
            value={{
                selectedDocuments,
                toggleDocument,
                clearSelection,
                selectAll,
                isSelected,
                mode,
                setMode,
            }}>
            {children}
        </DocumentSelectionContext.Provider>
    );
}

export function useDocumentSelection() {
    const context = useContext(DocumentSelectionContext);
    if (!context) {
        throw new Error(
            'useDocumentSelection must be used within DocumentSelectionProvider'
        );
    }
    return context;
}
