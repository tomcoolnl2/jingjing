import nx from '@nx/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    {
        ignores: ['**/dist'],
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        plugins: {
            prettier: prettierPlugin, // Use the plugin object here
        },
        rules: {
            'padding-line-between-statements': ['error', { blankLine: 'always', prev: 'function', next: '*' }],
            'prettier/prettier': 'error', // Enforce Prettier rules
        },
    },
];
