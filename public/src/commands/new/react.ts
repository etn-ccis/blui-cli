import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'react',
    alias: ['r'],
    description: 'Creates a new react project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { name, language, lint } = await toolbox.createProject.react();
        await toolbox.addPXBlue.react({ name, language, lint });
    },
};
