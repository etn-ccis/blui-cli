export const DEPENDENCIES = {
    ionic: [
        '@angular/cdk@^10.2.5',
        '@angular/flex-layout@^10.0.0-beta.32',
        '@angular/material@^10.2.5',
        '@pxblue/angular-themes@^5.2.0',
        '@pxblue/angular-components@^4.0.0',
        '@pxblue/icons@^1.1.0',
        '@pxblue/icons-svg@^1.1.1',
        '@pxblue/colors@^3.0.0',
        'typeface-open-sans',
    ],
    reactNative: [
        '@pxblue/react-native-themes@^5.0.0',
        '@pxblue/colors@^3.0.0',
        '@pxblue/react-native-components@^3.1.1',
        'react-native-paper@^4.2.0',
        '@pxblue/icons-svg@^1.1.1',
        'react-native-vector-icons@^7.1.0',
    ],
};
export const DEV_DEPENDENCIES = {
    ionic: [],
    reactNative: ['jest', 'react-test-renderer'],
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
