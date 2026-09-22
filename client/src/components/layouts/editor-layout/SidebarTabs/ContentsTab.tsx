import { SectionItem } from './types';
import { EmptyState } from './EmptyState';
import { ListTree } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface ContentsTabProps {
    sections: SectionItem[];
    onScrollToBlock: (blockId: string) => void;
    activeBlockId?: string;
}

export const ContentsTab = ({
    sections,
    onScrollToBlock,
    activeBlockId,
}: ContentsTabProps) => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('tableOfContents')}
            </h2>
            <div className="text-sm space-y-1.5">
                {sections.length === 0 ? (
                    <EmptyState
                        icon={<ListTree />}
                        title={t('noHeadings')}
                        description={t('noHeadingsDescription')}
                    />
                ) : (
                    sections.map((section) => {
                        const isActive = section.id === activeBlockId;
                        const level = section.level || 1;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => onScrollToBlock(section.id)}
                                className={`min-h-8 w-full rounded-md border px-2 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                                    isActive
                                        ? 'border-border bg-muted/60'
                                        : 'border-transparent hover:border-border hover:bg-muted/60'
                                }`}>
                                <span
                                    className={`block truncate text-sm ${level === 1 ? 'font-semibold' : level === 2 ? 'font-medium' : 'font-normal'}`}>
                                    {section.title}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};
