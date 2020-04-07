import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'angular',
    alias: ['a'],
    description: 'Creates a new angular project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { name, lint } = await toolbox.createProject.angular();
        await toolbox.addPXBlue.angular({ name, lint });
    },
};
