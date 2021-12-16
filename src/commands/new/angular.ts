import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'angular',
    // alias: ['a'],
    description: 'Creates a new angular project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        toolbox.fancyPrint.welcomeLogo();
        const { name, lint, prettier, template } = await toolbox.createProject.angular();
        await toolbox.addBLUI.angular({ name, lint, prettier, template });
    },
};
