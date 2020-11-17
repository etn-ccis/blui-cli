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
