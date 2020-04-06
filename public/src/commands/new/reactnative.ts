import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'react-native',
    alias: ['rn'],
    description: 'Creates a new react native project',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        await toolbox.createProject.reactNative();
    },
};
