import type { ComponentType, SVGProps } from 'react';

export interface Command {
    id: string;
    name: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    group: 'basic' | 'insert';
    keywords?: string[];
}
