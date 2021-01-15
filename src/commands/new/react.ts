import { GluegunToolbox } from 'gluegun';
import { printWelcomeLogo } from '../../utilities';

module.exports = {
    name: 'react',
    // alias: ['r'],
    description: 'Creates a new react project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        printWelcomeLogo(toolbox);
        const { name, language, lint, prettier } = await toolbox.createProject.react();
        await toolbox.addPXBlue.react({ name, language, lint, prettier });
    },
};
