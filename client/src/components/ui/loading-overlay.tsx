'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
    open: boolean;
    text: string;
}

export function LoadingOverlay({ open, text }: LoadingOverlayProps) {
    return (
        <DialogPrimitive.Root open={open}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
                <DialogPrimitive.Content
                    aria-describedby={undefined}
                    className="fixed inset-0 z-[90] flex items-center justify-center p-4 outline-none"
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onPointerDownOutside={(event) => event.preventDefault()}>
                    <DialogPrimitive.Title className="sr-only">
                        {text}
                    </DialogPrimitive.Title>
                    <div
                        role="status"
                        aria-busy="true"
                        aria-live="polite"
                        className="flex min-w-40 animate-in flex-col items-center gap-4 rounded-2xl border border-border/70 bg-card px-6 py-5 text-card-foreground shadow-xl fade-in-0 zoom-in-95 duration-150 ease-out motion-reduce:animate-none">
                        <span aria-hidden="true">
                            <Spinner size="lg" />
                        </span>
                        <span className="whitespace-nowrap text-sm font-medium">
                            {text}
                        </span>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
