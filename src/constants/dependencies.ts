const BASE_LINT_DEPENDENCIES = [
    '@brightlayer-ui/eslint-config@^2.0.2',
    'eslint@^7.11.0',
    'eslint-config-prettier@^6.13.0',
    '@typescript-eslint/eslint-plugin@^4.5.0',
    '@typescript-eslint/parser@^4.5.0',
];
const BASE_PRETTIER_DEPENDENCIES = ['prettier@^2.1.2', '@brightlayer-ui/prettier-config@^1.0.2'];

export const LINT_DEPENDENCIES = {
    angular: BASE_LINT_DEPENDENCIES,
    react: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.0.0']),
    reactNative: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.0.0']),
};
export const PRETTIER_DEPENDENCIES = {
    angular: BASE_PRETTIER_DEPENDENCIES,
    react: BASE_PRETTIER_DEPENDENCIES,
    reactNative: BASE_PRETTIER_DEPENDENCIES.slice(1),
};
