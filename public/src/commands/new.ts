import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'new',
    // alias: ['n'],
    description: 'Creates a new project (in chosen framework)',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { parse, print, createProject, addPXBlue } = toolbox;

        const [framework] = await parse([
            {
                question: 'Project Framework:',
                required: true,
                type: 'radio',
                choices: ['Angular', 'React', 'Ionic', 'React Native'],
            },
        ]);

        switch (framework) {
            case 'Angular':
                await addPXBlue.angular(await createProject.angular());
                break;
            case 'React':
                await addPXBlue.react(await createProject.react());
                break;
            case 'Ionic':
                await addPXBlue.ionic(await createProject.ionic());
                break;
            case 'React Native':
                await addPXBlue.reactNative(await createProject.reactNative());
                break;
            default:
                print.error('You must choose one of the supported frameworks.');
                return;
        }
    },
};
