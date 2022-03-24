export const DEPENDENCIES = {
    expo: [
        '@brightlayer-ui/react-native-themes@^6.0.0',
        '@brightlayer-ui/colors@^3.0.1',
        '@brightlayer-ui/react-native-components@^6.0.2',
        '@brightlayer-ui/react-native-vector-icons@^1.4.1',
        'react-native-paper@^4.11.2',
        '@brightlayer-ui/icons-svg@^1.8.1',
        'react-native-vector-icons@^9.1.0',
        'react-native-svg@^12.3.0',
        'react-native-svg-transformer@^1.0.0',
        'react-native-safe-area-context@^4.2.2',
    ],
};
export const DEV_DEPENDENCIES = {
    expo: ['jest', 'react-test-renderer', '@types/react-native-vector-icons'],
};
const BASE_LINT_DEPENDENCIES = [
    '@brightlayer-ui/eslint-config@^3.0.0',
    'eslint@^8.11.0',
    'eslint-config-prettier@^8.5.0',
    '@typescript-eslint/eslint-plugin@^5.16.0',
    '@typescript-eslint/parser@^5.16.0',
];
const BASE_PRETTIER_DEPENDENCIES = ['prettier@^2.6.0', '@brightlayer-ui/prettier-config@^1.0.3'];

export const LINT_DEPENDENCIES = {
    angular: BASE_LINT_DEPENDENCIES,
    react: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.29.4']),
    reactNative: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react@^7.29.4']),
};
export const PRETTIER_DEPENDENCIES = {
    angular: BASE_PRETTIER_DEPENDENCIES,
    react: BASE_PRETTIER_DEPENDENCIES,
    reactNative: BASE_PRETTIER_DEPENDENCIES.slice(1),
};
