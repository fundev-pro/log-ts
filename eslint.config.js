import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import unicorn from 'eslint-plugin-unicorn';

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked.map(config => ({
        ...config,
        files: ['**/*.ts'],
    })),
    ...tseslint.configs.recommended.map(config => ({
        ...config,
        files: ['**/*.ts.hbs'],
    })),
    prettierConfig,
    {
        files: ['**/*.ts'],
        plugins: {
            prettier: prettierPlugin,
            unicorn: unicorn,
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-non-null-assertion': 'warn',
            'no-console': 'off',
            'prefer-const': 'warn',
            'no-var': 'error',
            'unicorn/filename-case': [
                'error',
                {
                    case: 'kebabCase',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    custom: {
                        regex: '^I[A-Z]',
                        match: false,
                    },
                },
            ],
        },
    },
    {
        files: ['**/*.ts.hbs'],
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'no-console': 'off',
            'prefer-const': 'warn',
            'no-var': 'error',
        },
    },
    {
        files: ['eslint.config.js'],
        languageOptions: {
            parserOptions: {
                project: null,
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'warn',
            '@typescript-eslint/no-explicit-any': 'off',
            'no-console': 'off',
            'prefer-const': 'warn',
            'no-var': 'error',
        },
    },
    {
        ignores: [
            '**/dist/**',
            'dist/**',
            'node_modules/**',
            '*.js',
            '*.d.ts',
            '!eslint.config.js',
            '*.json.hbs',
        ],
    },
];
