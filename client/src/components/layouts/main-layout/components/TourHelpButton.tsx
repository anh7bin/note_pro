'use client';

import { CircleHelp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useI18n } from '@/contexts/I18nContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

export function TourHelpButton() {
    const { t } = useI18n();
    const { startTour, isTourRunning } = useOnboarding();
    const pathname = usePathname();

    return (
        <SimpleTooltip title={t('tourStartAgain')}>
            <span data-tour="tour-help" className="inline-flex">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={isTourRunning}
                    onClick={() =>
                        startTour(
                            pathname.startsWith('/editor/d/')
                                ? 'editor'
                                : 'workspace'
                        )
                    }>
                    <CircleHelp />
                </Button>
            </span>
        </SimpleTooltip>
    );
}
