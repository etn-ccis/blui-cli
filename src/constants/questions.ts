import { Template } from '../utilities';

/**
 * Questions asked when information is not provided directly
 * as a command line flag.
 */
export const QUESTIONS = {
    name: { optionName: 'name', question: 'Project Name', type: 'input' },
    lint: {
        optionName: 'lint',
        question: 'Use Brightlayer UI ESLint config?',
        type: 'confirm',
        initial: true,
    },
    prettier: {
        optionName: 'prettier',
        question: 'Use Brightlayer UI Prettier config?',
        type: 'confirm',
        initial: true,
    },
    framework: {
        optionName: 'framework',
        question: 'Project Framework:',
        required: true,
        type: 'radio',
        choices: ['Angular', 'React', 'React Native'],
    },
    template: {
        optionName: 'template',
        question: 'Choose a starting template:',
        type: 'radio',
        choices: ['Blank', 'Basic Routing', 'Authentication'] as Template[],
    },
};
