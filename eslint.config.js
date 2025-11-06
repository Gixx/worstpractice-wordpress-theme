import eslint   from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    {
        ignores: [
            '**/*.js',
            'dist',
            'node_modules',
            '*.css',
            '*.scss',
            '*.html',
            '*.php',
            '*.d.ts'
        ]
    },
    {
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-unused-vars': 'error',

            'indent': [
                'error',
                4
            ],
            'linebreak-style': [
                'error',
                'unix'
            ],
            'quotes': [
                'error',
                'single'
            ],
            'semi': [
                'error',
                'never'
            ]
        },
    },
];
