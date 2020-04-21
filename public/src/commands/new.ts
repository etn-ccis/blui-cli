import { GluegunToolbox } from 'gluegun';
import { stringToLowerCaseNoSpace } from '../utilities';

module.exports = {
    name: 'new',
    // alias: ['n'],
    description: 'Creates a new project (in chosen framework)',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { parse, print, createProject, addPXBlue } = toolbox;

        let framework = '',
            frameworkOptions = toolbox.parameters.options.framework;

        // have the user choose a framework if they did not use the framework flag or
        // only passed in a flag with no framework name following it.
        if (frameworkOptions === undefined || frameworkOptions === true) {
            [framework] = await parse([
                {
                    question: 'Project Framework:',
                    required: true,
                    type: 'radio',
                    choices: ['Angular', 'React', 'Ionic', 'React Native'],
                },
            ]);
        } else {
            framework = frameworkOptions;
        }

        framework = stringToLowerCaseNoSpace(framework);

        switch (framework) {
            case 'angular':
                await addPXBlue.angular(await createProject.angular());
                break;
            case 'react':
                await addPXBlue.react(await createProject.react());
                break;
            case 'ionic':
                await addPXBlue.ionic(await createProject.ionic());
                break;
            case 'reactnative':
                await addPXBlue.reactNative(await createProject.reactNative());
                break;
            default:
                print.error('You must specify one of the supported frameworks.');
                print.newline();
                print.info('PX Blue only support Angular, React, Ionic and React Native.');
                return;
        }
    },
};
