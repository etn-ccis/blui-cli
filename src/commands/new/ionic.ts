import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'ionic',
    // alias: ['i'],
    description: 'Creates a new ionic project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        toolbox.fancyPrint.welcomeLogo();
        const { name, lint, prettier, template } = await toolbox.createProject.ionic();
        await toolbox.addPXBlue.ionic({ name, lint, prettier, template });
    },
};
