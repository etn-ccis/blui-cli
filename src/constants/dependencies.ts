export const DEPENDENCIES = {
    expo: [
        '@pxblue/react-native-themes@^6.0.0',
        '@pxblue/colors@^3.0.1',
        '@pxblue/react-native-components@^6.0.0',
        '@pxblue/react-native-vector-icons@^1.0.0',
        'react-native-paper@^4.2.0',
        '@pxblue/icons-svg@^1.0.0',
        'react-native-vector-icons@^8.0.0',
        'react-native-svg@^12.1.0',
        'react-native-svg-transformer@^0.14.3',
        'react-native-safe-area-context@^3.1.9',
    ],
};
export const DEV_DEPENDENCIES = {
    expo: ['jest', 'react-test-renderer', '@types/react-native-vector-icons'],
};
const BASE_LINT_DEPENDENCIES = [
    '@pxblue/eslint-config@^2.0.2',
    'eslint@^7.11.0',
    'eslint-config-prettier@^6.13.0',
    '@typescript-eslint/eslint-plugin@^4.5.0',
    '@typescript-eslint/parser@^4.5.0',
];
const BASE_PRETTIER_DEPENDENCIES = ['prettier@^2.1.2', '@pxblue/prettier-config@^1.0.2'];

export const LINT_DEPENDENCIES = {
    angular: BASE_LINT_DEPENDENCIES,
    react: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.0.0']),
    ionic: BASE_LINT_DEPENDENCIES,
    reactNative: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.0.0']),
};
export const PRETTIER_DEPENDENCIES = {
    angular: BASE_PRETTIER_DEPENDENCIES,
    react: BASE_PRETTIER_DEPENDENCIES,
    ionic: BASE_PRETTIER_DEPENDENCIES,
    reactNative: BASE_PRETTIER_DEPENDENCIES.slice(1),
};
