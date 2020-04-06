import { AxiosProxyConfig } from 'axios'

// TODO: Find a way to make the proxy work...I believe this is now an issue with Eaton self-signed SSL certificate
export const PROXY: AxiosProxyConfig | false = false // process.env.HTTP_PROXY ? {
//     host: 'http://proxy.etn.com',//process.env.HTTP_PROXY.split(':')[0],
//     port: 8080,//process.env.HTTP_PROXY.split(':')[1]
//     auth:{
//       username: 'Enumber',
//       password: 'password'
//     }
// } : false;

export const STYLES = 'html, body {\r\n\theight: 100%;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}';

export const DEPENDENCIES = {
    angular: [
        '@angular/cdk',
        '@angular/flex-layout',
        '@angular/material',
        '@pxblue/angular-themes',
        '@pxblue/colors',
        'typeface-open-sans'
    ],
    // react: [
    //     { name: '@material-ui/core', version: '^4.2.0' },
    //     { name: '@material-ui/icons', version: '^4.2.1' },
    //     { name: '@pxblue/themes', version: '^3.0.2' },
    //     { name: '@pxblue/colors', version: '^2.0.0' },
    //     { name: 'react-app-polyfill', version: '^1.0.2' },
    //     { name: 'typeface-open-sans', version: '0.0.75' }
    // ],
    // ionic: [
    //     { name: '@angular/cdk', version: '^8.1.2' },
    //     { name: '@angular/flex-layout', version: '^8.0.0-beta.26' },
    //     { name: '@pxblue/themes', version: '^3.0.2' },
    //     { name: '@pxblue/colors', version: '^2.0.0' },
    //     { name: '@angular/material', version: '^8.1.2' },
    //     { name: 'typeface-open-sans', version: '0.0.75' }
    // ],
    // reactnative: [
    //     { name: '@pxblue/themes', version: '^3.0.2' },
    //     { name: '@pxblue/colors', version: '^2.0.0' },
    //     { name: '@pxblue/react-native-components', version: 'latest' },
    //     { name: 'react-native-vector-icons', version: 'latest' }
    // ]
}
export const DEV_DEPENDENCIES = {
    angular: [],
    // react: [
    //     { name: 'enzyme', version: '^3.10.0' },
    //     { name: 'enzyme-adapter-react-16', version: '^1.14.0' }
    // ],
    // ionic: [],
    // reactnative: [
    //     { name: 'jest', version: '^24.8.0' },
    //     { name: 'jest-expo', version: '^33.0.2' },
    //     { name: 'react-test-renderer', version: '^16.8.6' }
    // ]
}
const BASE_LINT_DEPENDENCIES = [
    '@pxblue/eslint-config',
    '@pxblue/prettier-config',
    'eslint',
    'eslint-config-prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'prettier',
]
export const LINT_DEPENDENCIES = {
    angular: BASE_LINT_DEPENDENCIES,
    react: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react']),
    ionic: BASE_LINT_DEPENDENCIES,
    reactNative: BASE_LINT_DEPENDENCIES.concat(['eslint-plugin-react']),
};

export const SCRIPTS = {
    angular: [
        { name: 'start', command: 'ng serve --configuration es5' }
    ],
    react: [],
    ionic: [],
    reactNative: [],
}

const BASE_LINT_SCRIPTS = {
    ts: [
        { name: 'lint', command: `eslint \"src/**/**.ts\"` },
        { name: 'lint:fix', command: `eslint \"src/**/**.ts\" --fix` },
        {
            name: 'prettier',
            command: `prettier \"src/**/**.{ts,js,json,css,scss,html}\" --write`
        }
    ],
    tsx: [
        { name: 'lint', command: `eslint \"src/**/**.{ts,tsx}\"` },
        { name: 'lint:fix', command: `eslint \"src/**/**.{ts,tsx}\" --fix` },
        {
            name: 'prettier',
            command: `prettier \"src/**/**.{ts,tsx,js,jsx,json,css,scss,html}\" --write`
        }
    ],
}
export const LINT_SCRIPTS = {
    angular: BASE_LINT_SCRIPTS.ts,
    ionic: BASE_LINT_SCRIPTS.ts,
    react: BASE_LINT_SCRIPTS.tsx,
    reactnative: BASE_LINT_SCRIPTS.tsx,
}

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
    };`
}

// export const PXBLUE_IMPORTS = {
//     angular: [],
//     react: [
//         "import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';",
//         "import CssBaseline from '@material-ui/core/CssBaseline';",
//         "import * as PXBThemes from '@pxblue/themes/react';",
//         "import 'typeface-open-sans';"
//     ],
//     ionic: [],
//     reactnative: []
// }

export const ROOT_COMPONENT = {
    angular:
        '<app-root class="pxb-blue mat-typography mat-app-background"></app-root>',
    react:
        '\r\n\t<MuiThemeProvider theme={createMuiTheme(PXBThemes.blue)}>\r\n\t\t<CssBaseline/>\r\n\t\t<App/>\r\n\t</MuiThemeProvider>\r\n',
    ionic:
        '<app-root class="pxb-blue mat-typography mat-app-background"></app-root>',
    reactnative: ''
}

export const SUPPORTED_BROWSERS = {
    object: {
        production: ['>0.2%', 'not dead', 'not op_mini all', 'ie 11'],
        development: [
            'last 1 chrome version',
            'last 1 firefox version',
            'last 1 safari version',
            'ie 11'
        ]
    },
    string: `> 0.5%\r\nlast 2 versions\r\nFirefox ESR\r\nnot dead\r\nIE 11`
}

