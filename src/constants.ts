import { Branch } from './types'
import { AxiosProxyConfig } from 'axios';

// TODO: Find a way to make the proxy work...I believe this is now an issue with Eaton self-signed SSL certificate
export const PROXY: AxiosProxyConfig | false = false;//process.env.HTTP_PROXY ? {
//     host: 'http://proxy.etn.com',//process.env.HTTP_PROXY.split(':')[0],
//     port: 8080,//process.env.HTTP_PROXY.split(':')[1]
//     auth:{
//       username: 'Enumber',
//       password: 'password'
//     }
// } : false;

export const EXAMPLE_BRANCHES: Array<Branch> = [
  {
    name: 'angular',
    node: 'node:12.6-browsers',
    test: 'yarn test --watch=false --no-progress',
    build: 'yarn build --prod --aot --no-progress'
  },
  {
    name: 'react',
    node: 'node:12.6-browsers',
    test: 'yarn test',
    build: 'yarn build'
  },
  {
    name: 'ionic',
    node: 'node:10.9-browsers',
    test: 'yarn test --watch=false --no-progress',
    build: 'yarn build'
  },
  {
    name: 'reactnative',
    node: 'node:12.6-browsers',
    test: 'yarn test',
    build: 'echo \\"No Build Script\\"'
  }
]
export const TEMPLATES_FOLDER = 'example_template'

export const STYLES =
  'html, body {\r\n\theight: 100%;\r\n\tmargin: 0;\r\n\tpadding: 0;\r\n}'

export const TEMP_FOLDER = `___temp_${Date.now()}___`

export const PXBLUE_DEPENDENCIES = {
  angular: [
    { name: '@angular/cdk', version: '^8.1.2' },
    { name: '@angular/flex-layout', version: '^8.0.0-beta.26' },
    { name: '@pxblue/themes', version: '^2.0.3' },
    { name: '@pxblue/colors', version: '^1.0.13' },
    { name: '@angular/material', version: '^8.1.2' },
    { name: 'typeface-open-sans', version: '0.0.75' }
  ],
  react: [
    { name: '@material-ui/core', version: '^4.2.0' },
    { name: '@material-ui/icons', version: '^4.2.1' },
    { name: '@pxblue/themes', version: '^2.0.3' },
    { name: '@pxblue/colors', version: '^1.0.13' },
    { name: 'react-app-polyfill', version: '^1.0.2' },
    { name: 'typeface-open-sans', version: '0.0.75' }
  ],
  ionic: [
    { name: '@angular/cdk', version: '^8.1.2' },
    { name: '@angular/flex-layout', version: '^8.0.0-beta.26' },
    { name: '@pxblue/themes', version: '^2.0.3' },
    { name: '@pxblue/colors', version: '^1.0.13' },
    { name: '@angular/material', version: '^8.1.2' },
    { name: 'typeface-open-sans', version: '0.0.75' }
  ],
  reactnative: [
    { name: '@pxblue/colors', version: '^1.0.13' },
    { name: '@pxblue/react-native-components', version: 'latest' },
    { name: 'react-native-vector-icons', version: 'latest' }
  ]
}
export const PXBLUE_DEV_DEPENDENCIES = {
  angular: [],
  react: [
    { name: 'enzyme', version: '^3.10.0' },
    { name: 'enzyme-adapter-react-16', version: '^1.14.0' }
  ],
  ionic: [],
  reactnative: [
    { name: 'jest', version: '^24.8.0' },
    { name: 'jest-expo', version: '^33.0.2' },
    { name: 'react-test-renderer', version: '^16.8.6' }
  ]
}
export const PXBLUE_DEV_DEPENDENCIES_TS = {
  react: [
    { name: '@pxblue/eslint-config', version: 'latest' },
    { name: 'eslint', version: 'latest' },
    { name: 'eslint-config-prettier', version: 'latest' },
    { name: '@typescript-eslint/eslint-plugin', version: 'latest' },
    { name: '@typescript-eslint/parser', version: 'latest' },
    { name: 'eslint-plugin-react', version: 'latest' },
    { name: 'prettier', version: 'latest' },
    { name: '@pxblue/prettier-config', version: 'latest' },
  ],
  reactnative: [
    { name: '@pxblue/eslint-config', version: 'latest' },
    { name: 'eslint', version: 'latest' },
    { name: 'eslint-config-prettier', version: 'latest' },
    { name: '@typescript-eslint/eslint-plugin', version: 'latest' },
    { name: '@typescript-eslint/parser', version: 'latest' },
    { name: 'eslint-plugin-react', version: 'latest' },
    { name: 'prettier', version: 'latest' },
    { name: '@pxblue/prettier-config', version: 'latest' },
  ]
}
export const PXBLUE_SCRIPTS_TS = {
  react: [
    { name: 'lint', command: `eslint \"src/**/**.{tsx,ts}\"` },
    { name: 'lint:fix', command: `eslint \"src/**/**.{tsx,ts}\" --fix` },
    { name: 'prettier', command: `prettier \"src/**/**.{ts,tsx,js,jsx,json,css,scss,html}\" --write` }
  ],
  reactnative: [
    { name: 'lint', command: `eslint \"**/**.{tsx,ts}\"` },
    { name: 'lint:fix', command: `eslint \"**/**.{tsx,ts}\" --fix` },
    { name: 'prettier', command: `prettier \"**/**.{ts,tsx,js,jsx,json,css,scss,html}\" --write` }
  ]
}

export const LINT_CONFIG = `module.exports =  {
  parser:  '@typescript-eslint/parser',
  extends:  [ '@pxblue/eslint-config/tsx' ],
  parserOptions:  {
      project: "./tsconfig.json",
  },
  env: {
      browser: true
  }
};`;

export const PXBLUE_IMPORTS = {
  angular: [],
  react: [
    "import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';",
    "import CssBaseline from '@material-ui/core/CssBaseline';",
    "//@ts-ignore",
    "import * as PXBThemes from '@pxblue/themes/react';",
    "import 'typeface-open-sans';"
  ],
  ionic: [],
  reactnative: []
}

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
  asObject: {
    production: ['>0.2%', 'not dead', 'not op_mini all', 'ie 11'],
    development: [
      'last 1 chrome version',
      'last 1 firefox version',
      'last 1 safari version',
      'ie 11'
    ]
  },
  asString: `> 0.5%\r\nlast 2 versions\r\nFirefox ESR\r\nnot dead\r\nIE 11`
}

export const REQUIRED_LABELS = [
  {
    name: 'android',
    description: 'Affects Android implementation',
    color: '567bc4'
  },
  {
    name: 'angular',
    description: 'Affects Angular implementation',
    color: 'e59e9e'
  },
  {
    name: 'bug',
    description: 'Something not working as expected',
    color: 'd73a4a'
  },
  { name: 'chrome', description: 'Limited to Chrome browser', color: 'ec9917' },
  // { name: "cordova", description: "Affects Cordova implementation", color:"f8e597" },
  // { name: "docs", description: "Problem with the documentation", color:"29f4aa" },
  // { name: "duplicate", description: "Already captured by another issue", color:"cfd3d7" },
  { name: 'edge', description: 'Limited to Edge browser', color: '0075ee' },
  // { name: "electron", description: "Affects Electron implementation", color:"9cdb90" },
  {
    name: 'enhancement',
    description: 'Request for improvement or new feature',
    color: 'a2eeef'
  },
  {
    name: 'external dependency',
    description: 'Depends on an upstream package or library',
    color: '9006e0'
  },
  {
    name: 'firefox',
    description: 'Limited to Firefox browser',
    color: 'ecbe23'
  },
  // { name: "good first issue", description: "A good issue for new contributors to get exposure", color:"7057ff" },
  // { name: "help wanted", description: "Need help from external contributors", color:"008672" },
  { name: 'ie11', description: 'Limited to IE11 browser', color: '0068b3' },
  // { name: "invalid", description: "Not a valid issue", color:"e4e669" },
  {
    name: 'ionic',
    description: 'Affects Ionic implementation',
    color: 'fabb90'
  },
  // { name: "performance", description: "Performance-related", color:"3aff23" },
  // { name: "question", description: "A question about the resource", color:"d110cd" },
  {
    name: 'react-native',
    description: 'Affects react-native implementation',
    color: 'cc9ff7'
  },
  {
    name: 'react',
    description: 'Affects React implementation',
    color: '80c4f9'
  },
  { name: 'safari', description: 'Limited to Safari browser', color: '333d43' },
  {
    name: 'wontfix',
    description: "Can't or won't be fixed by the dev team",
    color: 'ffffff'
  }
]
