import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginQuery from '@tanstack/eslint-plugin-query';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default tseslint.config(
    { ignores: ['dist', 'build', 'node_modules', '.next', 'coverage', 'next-env.d.ts'] },
    ...nextCoreWebVitals,
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier: prettierPlugin,
            '@tanstack/query': pluginQuery,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "semi": [ "error", "always" ],
            '@tanstack/query/exhaustive-deps': 'off',
            "no-restricted-imports": [
                "error",
                {
                    "patterns": ["@mui/*/*/*"]
                }
            ],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ],
        },
    },
    {
        // В тестах нужен require(): модуль перечитывается после jest.resetModules(),
        // чтобы проверить поведение при разных переменных окружения.
        files: ['**/*.test.ts', '**/*.test.tsx'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
)
