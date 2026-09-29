'use client';

import { usePathname } from 'next/navigation';
import { isEditorPath } from '@/lib/routes';

export function useIsEditorPage(): boolean {
    return isEditorPath(usePathname());
}
