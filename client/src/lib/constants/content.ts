import { HexColor } from '@/types/types';

const VIBRANT_COLORS = [
    { name: 'Charcoal', color: '#1c1c1e', value: '#1c1c1e' },
    { name: 'Graphite', color: '#636366', value: '#636366' },
    { name: 'Silver', color: '#d1d1d6', value: '#d1d1d6' },
    { name: 'Azure', color: '#007aff', value: '#007aff' },
    { name: 'Teal', color: '#00c7be', value: '#00c7be' },
    { name: 'Sky', color: '#5ac8fa', value: '#5ac8fa' },
    { name: 'Emerald', color: '#30d158', value: '#30d158' },
    { name: 'Lime', color: '#87e05f', value: '#87e05f' },
    { name: 'Grape', color: '#af52de', value: '#af52de' },
    { name: 'Fuchsia', color: '#ff2d55', value: '#ff2d55' },
    { name: 'Tangerine', color: '#ff9500', value: '#ff9500' },
    { name: 'Gold', color: '#ffcc00', value: '#ffcc00' },
];

export const FOLDER_COLORS = [...VIBRANT_COLORS];

export const HIGHLIGHT_COLORS = [
    { name: 'None', color: HexColor.TRANSPARENT, value: null },
    ...VIBRANT_COLORS,
];

export const TASK_STATUS = {
    TODO: 'todo',
    COMPLETED: 'completed',
};
