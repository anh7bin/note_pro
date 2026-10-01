'use client';

import { DocumentCardGridView } from './DocumentGrid/DocumentCardGridView';
import { DocumentListView } from './DocumentGrid/DocumentListView';
import { DocumentGridProps } from './DocumentGrid/types';

export function DocumentGrid({
    view = 'card',
    mode = 'default',
    ...rest
}: DocumentGridProps) {
    return view === 'list' ? (
        <DocumentListView mode={mode} {...rest} />
    ) : (
        <DocumentCardGridView mode={mode} {...rest} />
    );
}
