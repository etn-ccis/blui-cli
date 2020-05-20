export const DEPENDENCIES = {
    angular: [
        '@angular/cdk',
        '@angular/flex-layout',
        '@angular/material',
        '@pxblue/angular-themes',
        '@pxblue/angular-components',
        '@pxblue/icons',
        '@pxblue/icons-svg',
        '@pxblue/colors',
        'typeface-open-sans',
    ],
    react: [
        '@material-ui/core',
        '@material-ui/icons',
        '@pxblue/react-themes',
        '@pxblue/react-components',
        '@pxblue/icons-mui',
        '@pxblue/colors',
        'react-app-polyfill',
        'typeface-open-sans',
    ],
    ionic: [
        '@angular/cdk',
        '@angular/flex-layout',
        '@angular/material',
        '@pxblue/angular-themes',
        '@pxblue/angular-components',
        '@pxblue/icons',
        '@pxblue/icons-svg',
        '@pxblue/colors',
        'typeface-open-sans',
    ],
    reactNative: [
        '@pxblue/react-native-themes',
        '@pxblue/colors',
        '@pxblue/react-native-components',
        'react-native-paper',
        '@pxblue/icons-svg',
        'react-native-vector-icons',
    ],
};
export const DEV_DEPENDENCIES = {
    angular: [],
    react: ['enzyme', 'enzyme-adapter-react-16'],
    ionic: [],
    reactNative: ['jest', 'jest-expo', 'react-test-renderer'],
};
const BASE_LINT_DEPENDENCIES = [
    '@pxblue/eslint-config',
    '@pxblue/prettier-config',
    'eslint',
    'eslint-config-prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'prettier',
];
export const LINT_DEPENDENCIES = {
    angular: BASE_LINT_DEPENDENCIES,
    react: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react']),
    ionic: BASE_LINT_DEPENDENCIES,
    reactNative: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react']),
};

export const SCRIPTS = {
    angular: [{ name: 'start', command: 'ng serve --configuration es5' }],
    react: [],
    ionic: [],
    reactNative: [],
};

const BASE_LINT_SCRIPTS = {
    ts: [
        { name: 'lint', command: `eslint "src/**/**.ts"` },
        { name: 'lint:fix', command: `eslint "src/**/**.ts" --fix` },
        {
            name: 'prettier',
            command: `prettier "src/**/**.{ts,js,json,css,scss,html}" --write`,
        },
    ],
    tsx: [
        { name: 'lint', command: `eslint "src/**/**.{ts,tsx}"` },
        { name: 'lint:fix', command: `eslint "src/**/**.{ts,tsx}" --fix` },
        {
            name: 'prettier',
            command: `prettier "src/**/**.{ts,tsx,js,jsx,json,css,scss,html}" --write`,
        },
    ],
    root: [
        { name: 'lint', command: `eslint "**/**.{ts,tsx}"` },
        { name: 'lint:fix', command: `eslint "**/**.{ts,tsx}" --fix` },
        {
            name: 'prettier',
            command: `prettier "**/**.{ts,tsx,js,jsx,json,css,scss,html}" --write`,
        },
    ],
};
export const LINT_SCRIPTS = {
    angular: BASE_LINT_SCRIPTS.ts,
    ionic: BASE_LINT_SCRIPTS.ts,
    react: BASE_LINT_SCRIPTS.tsx,
    reactNative: BASE_LINT_SCRIPTS.root,
};

export const LINT_CONFIG = {
    ts: `module.exports =  {
        parser:  '@typescript-eslint/parser',
        extends:  [ '@pxblue/eslint-config/ts' ],
        parserOptions:  {
            project: "./tsconfig.json",
        },
        env: {
            browser: true
        }
    };`,
    tsx: `module.exports =  {
        parser:  '@typescript-eslint/parser',
        extends:  [ '@pxblue/eslint-config/tsx' ],
        parserOptions:  {
            project: "./tsconfig.json",
        },
        env: {
            browser: true
        }
    };`,
};

export const ROOT_IMPORTS = {
    angular: [],
    react: [
        "import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';",
        "import CssBaseline from '@material-ui/core/CssBaseline';",
        "import * as PXBThemes from '@pxblue/react-themes';",
        "import 'typeface-open-sans';",
    ],
    ionic: [],
    reactNative: [],
};

export const ROOT_COMPONENT = {
    angular: '<app-root class="pxb-blue mat-typography mat-app-background"></app-root>',
    react:
        '\r\n\t<ThemeProvider theme={createMuiTheme(PXBThemes.blue)}>\r\n\t\t<CssBaseline/>\r\n\t\t<App/>\r\n\t</ThemeProvider>\r\n',
    ionic: '<app-root class="pxb-blue mat-typography mat-app-background"></app-root>',
    reactNative: '',
};

export const SUPPORTED_BROWSERS = {
    object: {
        production: ['>0.2%', 'not dead', 'not op_mini all', 'ie 11'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version', 'ie 11'],
    },
    string: `> 0.5%\r\nlast 2 versions\r\nFirefox ESR\r\nnot dead\r\nIE 11`,
};

export const STYLES = 'html, body {\r\n\theight: 100%;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}';

// Command Prompts
export const QUESTIONS = {
    name: { optionName: 'name', question: 'Project Name', type: 'input' },
    lint: {
        optionName: 'lint',
        question: 'Use PX Blue Lint & Prettier configs?',
        type: 'confirm',
        initial: true,
    },
    language: {
        optionName: 'language',
        question: 'Language',
        type: 'radio',
        choices: ['TypeScript', 'JavaScript'],
    },
    cli: {
        optionName: 'cli',
        question: 'Which CLI should we use?',
        type: 'radio',
        choices: ['React Native Community (recommended)', 'Expo'],
    },
    framework: {
        optionName: 'framework',
        question: 'Project Framework:',
        required: true,
        type: 'radio',
        choices: ['Angular', 'React', 'Ionic', 'React Native'],
    },
};
