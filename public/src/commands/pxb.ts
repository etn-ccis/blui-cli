import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'pxb',
    run: (toolbox: GluegunToolbox): void => {
        const { print } = toolbox;

        print.info('Welcome to your CLI');
    },
};
