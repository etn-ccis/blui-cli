export const LINT_CONFIG = {
    ts: `module.exports =  {
        root: true,
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
        root: true,
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
