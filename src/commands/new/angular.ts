import { GluegunToolbox } from 'gluegun';
import { printWelcomeLogo } from '../../utilities';

module.exports = {
    name: 'angular',
    // alias: ['a'],
    description: 'Creates a new angular project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        printWelcomeLogo(toolbox);
        const { name, lint, prettier, template } = await toolbox.createProject.angular();
        await toolbox.addPXBlue.angular({ name, lint, prettier, template });
    },
};
