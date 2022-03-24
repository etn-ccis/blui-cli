/* eslint-disable */ 
export const JEST = {
    TRANSFORM_IGNORE_PATTERNS: ['node_modules/(@react-native-community|react-navigation|@react-navigation/.*)'],
    SETUP_FILES: ['./jestSetupFile.js', './node_modules/react-native-gesture-handler/jestSetup.js'],
    MODULE_NAME_MAPPER: {
        '\\.svg': '<rootDir>/__mocks__/svgMock.js',
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
        '\\.(css|less)$': 'identity-obj-proxy',
    },
};
