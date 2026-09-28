import { Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { ACCENT_COLORS, type AccentColor } from '@/lib/accent-colors';
import { cn } from '@/lib/utils';

interface AccentColorPickerProps {
    value: AccentColor;
    onChange: (color: AccentColor) => void;
}

const COLOR_LABEL_KEYS = {
    blue: 'accentBlue',
    pink: 'accentPink',
    teal: 'accentTeal',
    purple: 'accentPurple',
    yellow: 'accentYellow',
    gray: 'accentGray',
} as const;

export function AccentColorPicker({ value, onChange }: AccentColorPickerProps) {
    const { t } = useI18n();

    return (
        <fieldset className="rounded-lg bg-muted/60 p-3">
            <legend className="sr-only">{t('accentColor')}</legend>
            <div className="text-sm font-medium text-foreground">
                {t('accentColor')}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
                {t('accentColorDescription')}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
                {ACCENT_COLORS.map((color) => {
                    const selected = value === color;

                    return (
                        <button
                            key={color}
                            type="button"
                            aria-label={t(COLOR_LABEL_KEYS[color])}
                            aria-pressed={selected}
                            onClick={() => onChange(color)}
                            className={cn(
                                'flex size-8 items-center justify-center rounded-full transition-[box-shadow,transform] duration-150',
                                'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                                selected &&
                                    'ring-2 ring-primary ring-offset-2 ring-offset-surface'
                            )}
                            style={{
                                backgroundColor: `hsl(var(--accent-${color}))`,
                            }}>
                            {selected && (
                                <Check
                                    className="size-4 text-primary-foreground"
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}
