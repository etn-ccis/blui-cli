import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'angular',
    alias: ['a'],
    description: 'Creates a new angular project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        await toolbox.createProject.angular();
    },
};
