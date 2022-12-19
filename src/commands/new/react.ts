import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'react',
    // alias: ['r'],
    description: 'Creates a new react project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        toolbox.fancyPrint.welcomeLogo();
        const { name, lint, prettier } = await toolbox.createProject.react();
        await toolbox.addBLUI.react({ name, lint, prettier });
    },
};
