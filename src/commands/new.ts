import { GluegunToolbox } from 'gluegun';
import { stringToLowerCaseNoSpace } from '../utilities';
import { QUESTIONS } from '../constants';

/**
 * The following commands get executed when the user uses `blui new`
 * For the commands get run when the user uses `blui new <framework>`, see
 * the corresponding files in ./new/
 */
module.exports = {
    name: 'new',
    // alias: ['n'],
    description: 'Creates a new project (in chosen framework)',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { parse, print, createProject, addBLUI, fancyPrint } = toolbox;

        fancyPrint.welcomeLogo();

        let framework: string;
        [framework] = await parse([QUESTIONS.framework]);
        framework = stringToLowerCaseNoSpace(framework);

        switch (framework) {
            case 'angular':
                await addBLUI.angular(await createProject.angular());
                break;
            case 'react':
                await addBLUI.react(await createProject.react());
                break;
            case 'reactnative':
                await addBLUI.reactNative(await createProject.reactNative());
                break;
            default:
                print.error('You must specify one of the supported frameworks.');
                print.info('Brightlayer UI only supports Angular, React and React-Native.');
                return;
        }
    },
};
