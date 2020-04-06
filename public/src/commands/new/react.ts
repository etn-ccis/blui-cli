import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'react',
    alias: ['r'],
    description: 'Creates a new react project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        await toolbox.createProject.react();
    },
};
