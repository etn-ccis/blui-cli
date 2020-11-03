import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'react',
    // alias: ['r'],
    description: 'Creates a new react project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { name, language, lint, prettier, template } = await toolbox.createProject.react();
        await toolbox.addPXBlue.react({ name, language, lint, prettier, template });
    },
};
