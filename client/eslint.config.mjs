import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-expressions': 'warn',
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@radix-ui/react-tooltip',
                            message:
                                'Use the shared SimpleTooltip component instead.',
                        },
                        {
                            name: '@/components/ui/tooltip',
                            message:
                                'Use the shared SimpleTooltip component instead.',
                        },
                    ],
                },
            ],
            'no-restricted-syntax': [
                'error',
                {
                    selector:
                        "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^[a-z]/] > JSXAttribute[name.name='title']",
                    message:
                        'Use SimpleTooltip (or TruncatedTooltip for clipped text) instead of a native title tooltip.',
                },
            ],
        },
    },
    {
        files: ['src/components/features/page/SimpleTooltip.tsx'],
        rules: {
            'no-restricted-imports': 'off',
        },
    },
    {
        files: [
            'src/generated/**/*',
            'src/graphql/**/__generated__/**/*',
            'src/types/generated/**/*',
        ],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
];

export default eslintConfig;
