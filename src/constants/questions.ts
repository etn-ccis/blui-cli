import { Template } from '../utilities';

/**
 * Questions asked when information is not provided directly
 * as a command line flag.
 */
export const QUESTIONS = {
    name: { optionName: 'name', question: 'Project Name', type: 'input' },
    lint: {
        optionName: 'lint',
        question: 'Use PX Blue ESLint config?',
        type: 'confirm',
        initial: true,
    },
    prettier: {
        optionName: 'prettier',
        question: 'Use PX Blue Prettier config?',
        type: 'confirm',
        initial: true,
    },
    language: {
        optionName: 'language',
        question: 'Language',
        type: 'radio',
        choices: ['TypeScript', 'JavaScript'],
    },
    cli: {
        optionName: 'cli',
        question: 'Which CLI should we use?',
        type: 'radio',
        choices: ['React Native Community (recommended)', 'Expo'],
    },
    framework: {
        optionName: 'framework',
        question: 'Project Framework:',
        required: true,
        type: 'radio',
        choices: ['Angular', 'React', 'Ionic', 'React Native'],
    },
    template: {
        optionName: 'template',
        question: 'Choose a starting template:',
        type: 'radio',
        choices: ['Blank', 'Basic Routing', 'Authentication'] as Template[],
    },
    // @TODO remove reactNativeTemplate in favor of template once all the templates are complete
    reactNativeTemplate: {
        optionName: 'template',
        question: 'Choose a starting template:',
        type: 'radio',
        choices: ['Blank'] as Template[],
    },
};
