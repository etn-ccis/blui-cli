import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'ionic',
    // alias: ['i'],
    description: 'Creates a new ionic project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { name, lint, prettier } = await toolbox.createProject.ionic();
        await toolbox.addPXBlue.ionic({ name, lint, prettier });
    },
};
