/**
 * Questions asked when certain informations are not provided directly
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
        question: 'Use templates to kickstart your project?',
        type: 'radio',
        choices: ['No template', 'Authentication Workflows (login, account creation, etc)', 'Dashboard', 'Routing'],
    },
};
