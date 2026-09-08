import { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: number;
    description?: string;
    icon: ReactNode;
}

export const StatCard = ({
    label,
    value,
    description,
    icon,
}: StatCardProps) => {
    return (
        <div className="rounded-md border border-border-subtle px-2 py-2 text-left">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-base font-semibold leading-tight">{value}</div>
            {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
            )}
        </div>
    );
};
