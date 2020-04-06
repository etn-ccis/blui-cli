import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'ionic',
    alias: ['i'],
    description: 'Creates a new ionic project',
    run: async (toolbox: GluegunToolbox) => {
        await toolbox.createProject.ionic();
    }
}

