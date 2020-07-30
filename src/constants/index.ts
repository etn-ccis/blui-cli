export const DEPENDENCIES = {
    angular: [
        '@angular/cdk@^9.0.0',
        '@angular/flex-layout@^9.0.0-beta.31',
        '@angular/material@^9.0.0',
        '@pxblue/angular-themes@^5.0.0',
        '@pxblue/angular-components@^2.0.0',
        '@pxblue/icons@^1.0.0',
        '@pxblue/icons-svg@^1.0.0',
        '@pxblue/colors@^3.0.0',
        'typeface-open-sans',
    ],
    react: [
        '@material-ui/core@^4.0.0',
        '@material-ui/icons@^4.0.0',
        '@pxblue/react-themes@^5.0.0',
        '@pxblue/react-components@^4.0.0',
        '@pxblue/icons-mui@^2.0.0',
        '@pxblue/colors@^3.0.0',
        'react-app-polyfill',
        'typeface-open-sans',
    ],
    ionic: [
        '@angular/cdk@^9.0.0',
        '@angular/flex-layout@^9.0.0-beta.31',
        '@angular/material@^9.0.0',
        '@pxblue/angular-themes@^5.0.0',
        '@pxblue/angular-components@^2.0.0',
        '@pxblue/icons@^1.0.0',
        '@pxblue/icons-svg@^1.0.0',
        '@pxblue/colors@^3.0.0',
        'typeface-open-sans',
    ],
    reactNative: [
        '@pxblue/react-native-themes@^5.0.0',
        '@pxblue/colors@^3.0.0',
        '@pxblue/react-native-components@^3.0.0',
        'react-native-paper@^3.0.0',
        '@pxblue/icons-svg@^1.0.0',
        'react-native-vector-icons@^6.6.0',
    ],
};
export const DEV_DEPENDENCIES = {
    angular: [],
    react: ['enzyme@^3.11.0', 'enzyme-adapter-react-16@^1.15.0'],
    ionic: [],
    reactNative: ['jest', 'react-test-renderer'],
};
const BASE_LINT_DEPENDENCIES = [
    '@pxblue/eslint-config@^2.0.0',
    'eslint@^6.0.0',
    'eslint-config-prettier@^6.0.0',
    '@typescript-eslint/eslint-plugin@^3.0.0',
    '@typescript-eslint/parser@^3.0.0',
];
const BASE_PRETTIER_DEPENDENCIES = ['prettier@^2.0.0', '@pxblue/prettier-config@^1.0.0'];

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
    ionic: BASE_LINT_SCRIPTS.ts,
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
    ionic: BASE_PRETTIER_SCRIPTS.ts,
    react: BASE_PRETTIER_SCRIPTS.tsx,
    reactNative: BASE_PRETTIER_SCRIPTS.root,
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

export const PRETTIER_CONFIG = {
    rc: 'module.exports = {\r\n\t...require("@pxblue/prettier-config")\r\n};',
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
        production: ['>0.2%', 'not dead', 'not op_mini all', 'IE 11', 'not IE 9-10'],
        development: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version', 'ie 11', 'not ie'],
    },
    string: `> 0.5%\r\nlast 2 versions\r\nFirefox ESR\r\nnot dead\r\nIE 11\r\nnot IE 9-10`,
};

export const STYLES = 'html, body {\r\n\theight: 100%;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}';

// Command Prompts
export const QUESTIONS = {
    name: { optionName: 'name', question: 'Project Name', type: 'input' },
    lint: {
        optionName: 'lint',
        question: 'Use PX Blue ESLint config?',
        type: 'confirm',
        initial: true,
    },
    prettier: {
        optionName: 'prettier',
        question: 'Use PX Blue Prettier config?',
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
