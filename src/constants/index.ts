export const DEPENDENCIES = {
    angular: [
        '@angular/cdk@^10.2.5',
        '@angular/flex-layout@^10.0.0-beta.32',
        '@angular/material@^10.2.5',
        '@pxblue/angular-themes@^5.1.2',
        '@pxblue/angular-components@^3.0.1',
        '@pxblue/icons@^1.1.0',
        '@pxblue/icons-svg@^1.1.1',
        '@pxblue/colors@^3.0.0',
        'typeface-open-sans',
    ],
    react: [
        '@material-ui/core@^4.11.0',
        '@material-ui/icons@^4.9.1',
        '@pxblue/react-themes@^5.0.2',
        '@pxblue/react-components@^4.1.1',
        '@pxblue/icons-mui@^2.2.1',
        '@pxblue/colors@^3.0.0',
        'react-app-polyfill',
        'typeface-open-sans',
    ],
    ionic: [
        '@angular/cdk@^10.2.5',
        '@angular/flex-layout@^10.0.0-beta.32',
        '@angular/material@^10.2.5',
        '@pxblue/angular-themes@^5.1.2',
        '@pxblue/angular-components@^3.0.1',
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
    angular: [],
    react: ['enzyme@^3.11.0', 'enzyme-adapter-react-16@^1.15.0'],
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
    angular: '<body class="pxb-blue mat-typography mat-app-background">',
    react:
        '\r\n\t<ThemeProvider theme={createMuiTheme(PXBThemes.blue)}>\r\n\t\t<CssBaseline/>\r\n\t\t<App/>\r\n\t</ThemeProvider>\r\n',
    ionic: '<app-root class="pxb-blue mat-typography mat-app-background"></app-root>',
    reactNative: '',
};

export const APP_COMPONENT = {
    angular: '',
    react: `import React from 'react';
        import logo from './logo.svg';
        import './App.css';
        
        
        const App:React.FC = () => (
          <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
        )
        
        export default App;`,
    ionic: '',
    reactNative: '',
};

export const SUPPORTED_BROWSERS = {
    object: {
        production: ['>0.2%', 'not dead', 'not op_mini all', 'IE 11', 'not IE 9-10'],
        development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version',
            'ie 11',
            'not ie 9-10',
        ],
    },
    string: `> 0.5%\r\nlast 2 versions\r\nFirefox ESR\r\nnot dead\r\nIE 11\r\nnot IE 9-10`,
};

export const STYLES = 'html, body {\r\n\theight: 100%;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}';

export * from './questions';
