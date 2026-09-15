'use client';

import { createContext, useContext } from 'react';

export type TourName = 'workspace' | 'editor';

interface OnboardingContextValue {
    startTour: (tour: TourName) => void;
    isTourRunning: boolean;
}

export const OnboardingContext = createContext<OnboardingContextValue>({
    startTour: () => {},
    isTourRunning: false,
});

export function useOnboarding() {
    return useContext(OnboardingContext);
}
