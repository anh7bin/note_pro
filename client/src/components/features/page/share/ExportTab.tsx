'use client';

import { EmptyState } from '@/components/shared';
import { FileOutput } from 'lucide-react';

export function ExportTab() {
    return (
        <div className="py-4">
            <EmptyState
                compact
                icon={<FileOutput />}
                title="Export is coming soon"
                description="PDF and image export are not available yet."
            />
        </div>
    );
}
