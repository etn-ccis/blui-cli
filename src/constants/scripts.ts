export const SCRIPTS = {
    angular: [{ name: 'start', command: 'ng serve --open' }],
    reactNative: [],
};

const BASE_LINT_SCRIPTS = {
    ts: [
        { name: 'lint', command: `eslint "src/**/**.ts"` },
        { name: 'lint:fix', command: `eslint "src/**/**.ts" --fix` },
    ],
    tsx: [
        { name: 'lint', command: `eslint "src/**/**.{ts,tsx}"` },
        { name: 'lint:fix', command: `eslint "src/**/**.{ts,tsx}" --fix` },
    ],
    root: [
        { name: 'lint', command: `eslint "**/**.{ts,tsx}"` },
        { name: 'lint:fix', command: `eslint "**/**.{ts,tsx}" --fix` },
    ],
};
export const LINT_SCRIPTS = {
    angular: BASE_LINT_SCRIPTS.ts,
    react: BASE_LINT_SCRIPTS.tsx,
    reactNative: BASE_LINT_SCRIPTS.root,
};

const BASE_PRETTIER_SCRIPTS = {
    ts: [
        {
            name: 'prettier',
            command: `prettier "src/**/**.{ts,js,json,css,scss,html}" --write`,
        },
        {
            name: 'prettier:check',
            command: `prettier "src/**/**.{ts,js,json,css,scss,html}" --check`,
        },
    ],
    tsx: [
        {
            name: 'prettier',
            command: `prettier "src/**/**.{ts,tsx,js,jsx,json,css,scss,html}" --write`,
        },
        {
            name: 'prettier:check',
            command: `prettier "src/**/**.{ts,tsx,js,jsx,json,css,scss,html}" --check`,
        },
    ],
    root: [
        {
            name: 'prettier',
            command: `prettier "**/**.{ts,tsx,js,jsx,json,css,scss,html}" --write`,
        },
        {
            name: 'prettier:check',
            command: `prettier "**/**.{ts,tsx,js,jsx,json,css,scss,html}" --check`,
        },
    ],
};
export const PRETTIER_SCRIPTS = {
    angular: BASE_PRETTIER_SCRIPTS.ts,
    react: BASE_PRETTIER_SCRIPTS.tsx,
    reactNative: BASE_PRETTIER_SCRIPTS.root,
};
