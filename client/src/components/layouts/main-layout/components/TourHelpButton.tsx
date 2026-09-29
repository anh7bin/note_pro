'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useIsEditorPage } from '@/hooks/useIsEditorPage';
import { CircleHelp } from 'lucide-react';

export function TourHelpButton() {
    const { t } = useI18n();
    const onEditorPage = useIsEditorPage();
    const { startTour, isTourRunning } = useOnboarding();

    return (
        <SimpleTooltip title={t('tourStartAgain')}>
            <span data-tour="tour-help" className="inline-flex">
                <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={isTourRunning}
                    onClick={() =>
                        startTour(onEditorPage ? 'editor' : 'workspace')
                    }>
                    <CircleHelp />
                </Button>
            </span>
        </SimpleTooltip>
    );
}
