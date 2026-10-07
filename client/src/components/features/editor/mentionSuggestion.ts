import { filterMentionUsers, type MentionUser } from '@/types/mentions';
import { ReactRenderer } from '@tiptap/react';
import { exitSuggestion, type SuggestionOptions } from '@tiptap/suggestion';
import type { MentionNodeAttrs } from '@tiptap/extension-mention';
import {
    MentionSuggestionList,
    type MentionSuggestionListRef,
} from './MentionSuggestionList';

const MENU_WIDTH = 288;
const VIEWPORT_MARGIN = 8;

function positionMenu(element: HTMLElement, rect: DOMRect | null) {
    if (!rect) return;

    const left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(rect.left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN)
    );
    const menuHeight = element.offsetHeight || 240;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;
    const top =
        spaceBelow >= Math.min(menuHeight, 240)
            ? rect.bottom + 6
            : Math.max(VIEWPORT_MARGIN, rect.top - menuHeight - 6);

    Object.assign(element.style, {
        position: 'fixed',
        zIndex: '80',
        left: `${left}px`,
        top: `${top}px`,
    });
}

export function createMentionSuggestion(
    getUsers: () => MentionUser[]
): Omit<SuggestionOptions<MentionUser, MentionNodeAttrs>, 'editor'> {
    return {
        char: '@',
        allowSpaces: false,
        items: ({ query }) => filterMentionUsers(getUsers(), query),
        command: ({ editor, range, props }) => {
            editor
                .chain()
                .focus()
                .insertContentAt(range, [
                    {
                        type: 'mention',
                        attrs: {
                            id: props.id,
                            label: props.label,
                        },
                    },
                    { type: 'text', text: ' ' },
                ])
                .run();
        },
        render: () => {
            let renderer: ReactRenderer<MentionSuggestionListRef> | null = null;

            const updatePosition = (
                clientRect?: (() => DOMRect | null) | null
            ) => {
                if (!renderer) return;
                positionMenu(renderer.element, clientRect?.() ?? null);
            };

            return {
                onStart: (props) => {
                    renderer = new ReactRenderer(MentionSuggestionList, {
                        props,
                        editor: props.editor,
                    });
                    document.body.appendChild(renderer.element);
                    updatePosition(props.clientRect);
                },
                onUpdate: (props) => {
                    renderer?.updateProps(props);
                    requestAnimationFrame(() =>
                        updatePosition(props.clientRect)
                    );
                },
                onKeyDown: ({ event, view }) => {
                    if (event.key === 'Escape') {
                        exitSuggestion(view);
                        return true;
                    }
                    return renderer?.ref?.onKeyDown(event) ?? false;
                },
                onExit: () => {
                    renderer?.element.remove();
                    renderer?.destroy();
                    renderer = null;
                },
            };
        },
    };
}
