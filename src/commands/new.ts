import { GluegunToolbox } from 'gluegun';
import { stringToLowerCaseNoSpace } from '../utilities';
import { QUESTIONS } from '../constants';

/**
 * The following commands get executed when the user uses `pxb new`
 * For the commands get run when the user uses `pxb new <framework>`, see
 * the corresponding files in ./new/
 */
module.exports = {
    name: 'new',
    // alias: ['n'],
    description: 'Creates a new project (in chosen framework)',
    run: async (toolbox: GluegunToolbox): Promise<void> => {
        const { parse, print, createProject, addPXBlue } = toolbox;
        const { colors } = print;

        print.info('');
        print.info(colors.blue('                          ######'));
        print.info(colors.blue('                        ##    ### '));
        print.info(colors.blue('                ######  ##    ##  '));
        print.info(colors.blue('            ####           ##'));
        print.info(colors.blue('         ###'));
        print.info(colors.blue('       ###'));
        print.info(colors.blue('      ##                                        #'));
        print.info(colors.blue('    ###                                          # '));
        print.info(colors.blue('   ##                  ######                    #  '));
        print.info(colors.blue('  ##                #############                ## '));
        print.info(colors.blue(' ##                ###############               ##  '));
        print.info(colors.blue(' ##               #################               ##'));
        print.info(colors.blue(' ##                ###############                ## '));
        print.info(colors.blue('  ##                #############                ##'));
        print.info(colors.blue('   ##                   #####                   ## '));
        print.info(colors.blue('    ##                                         ##  '));
        print.info(colors.blue('     ##                                       ## '));
        print.info(colors.blue('      ###                                   ###  '));
        print.info(colors.blue('        ###                               ## '));
        print.info(colors.blue('           ####                       ####  '));
        print.info(colors.blue('               ######           #####   '));
        print.info(colors.blue('                       ###### '));
        print.info(colors.blue(''));
        print.info(colors.blue('             Welcome To Power Xpert Blue'));
        print.info(colors.white('        Powering Teams to Make What Matters *'));
        print.info(colors.blue(''));

        let framework: string;
        [framework] = await parse([QUESTIONS.framework]);
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
                print.info('PX Blue only supports Angular, React, Ionic and React-Native.');
                return;
        }
    },
};
