import { EditorColorPicker } from './EditorColorPicker';

interface Props {
    show: boolean;
    toggle: () => void;
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
    close: () => void;
}

export const HighlightPicker = ({
    show,
    toggle,
    onSelect,
    currentColor,
    isActive,
    close,
}: Props) => {
    return (
        <EditorColorPicker
            kind="highlight"
            show={show}
            toggle={toggle}
            onSelect={onSelect}
            currentColor={currentColor}
            isActive={isActive}
            close={close}
        />
    );
};
