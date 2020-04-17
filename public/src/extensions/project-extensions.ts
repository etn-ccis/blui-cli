/*
 * This file includes utilities for creating new skeleton projects in any framework using
 * the associated CLIs via npx.
 */
import { GluegunToolbox } from 'gluegun';

type NewAngularResult = {
    name: string;
    lint: boolean;
};
type NewReactResult = {
    name: string;
    language: 'TypeScript' | 'JavaScript';
    lint: boolean;
};
type NewReactNativeResult = {
    name: string;
    language: 'TypeScript' | 'JavaScript';
    lint: boolean;
    cli: 'Expo' | 'RNC';
};

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, parse, print } = toolbox;

    const createAngularProject = async (): Promise<NewAngularResult> => {
        let name,
            nameOption = toolbox.parameters.options.name;
        if (nameOption === undefined) {
            [name] = await parse([{ question: 'Project Name', required: true }]);
        } else {
            name = nameOption;
        }

        let lint,
            lintOption = toolbox.parameters.options.lint;
        if (lintOption === undefined) {
            [lint] = await parse([
                {
                    question: 'Use PX Blue Lint & Prettier configs?',
                    required: true,
                    type: 'radio',
                    choices: ['Yes', 'No'],
                },
            ]);
        } else {
            lint = !!lintOption;
        }

        const command = `npx -p @angular/cli ng new ${name} --directory "${name}" --style=scss`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Angular project in ${timer() / 1000} seconds`);

        return { name, lint: lint === 'Yes' };
    };

    const createReactProject = async (): Promise<NewReactResult> => {
        let name,
            nameOption = toolbox.parameters.options.name;
        if (nameOption === undefined) {
            [name] = await parse([{ question: 'Project Name', required: true }]);
        } else {
            name = nameOption;
        }

        let language,
            languageOption = toolbox.parameters.options.language;
        if (languageOption === undefined) {
            [language] = await parse([
                { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
            ]);
        } else {
            language = languageOption;
        }

        let lint = false;
        if (language === 'TypeScript') {
            let lintOption = toolbox.parameters.options.lint;
            if (lintOption === undefined) {
                const [lintTemp] = await parse([
                    {
                        question: 'Use PX Blue Lint & Prettier configs?',
                        required: true,
                        type: 'radio',
                        choices: ['Yes', 'No'],
                    },
                ]);
                lint = lintTemp === 'Yes';
            } else {
                lint = !!lintOption;
            }
        }

        const command = `npx create-react-app ${name} ${language === 'TypeScript' ? '--template typescript' : ''}`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React project in ${timer() / 1000} seconds`);

        return { name, language, lint };
    };

    const createIonicProject = async (): Promise<NewAngularResult> => {
        let name,
            nameOption = toolbox.parameters.options.name;
        if (nameOption === undefined) {
            [name] = await parse([{ question: 'Project Name', required: true }]);
        } else {
            name = nameOption;
        }

        let lint = false,
            lintOption = toolbox.parameters.options.lint;
        if (lintOption === undefined) {
            const [lintTemp] = await parse([
                {
                    question: 'Use PX Blue Lint & Prettier configs?',
                    required: true,
                    type: 'radio',
                    choices: ['Yes', 'No'],
                },
            ]);
            lint = lintTemp === 'Yes';
        } else {
            lint = !!lintOption;
        }

        const command = `npx ionic start ${name} blank`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Ionic project in ${timer() / 1000} seconds`);

        return { name, lint };
    };

    const createReactNativeProject = async (): Promise<NewReactNativeResult> => {
        let name,
            nameOption = toolbox.parameters.options.name;
        if (nameOption === undefined) {
            [name] = await parse([{ question: 'Project Name', required: true }]);
        } else {
            name = nameOption;
        }

        let language,
            languageOption = toolbox.parameters.options.language;
        if (languageOption === undefined) {
            [language] = await parse([
                { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
            ]);
        } else {
            language = languageOption;
        }

        let lint = false;
        if (language === 'TypeScript') {
            let lintOption = toolbox.parameters.options.lint;
            if (lintOption === undefined) {
                const [lintTemp] = await parse([
                    {
                        question: 'Use PX Blue Lint & Prettier configs?',
                        required: true,
                        type: 'radio',
                        choices: ['Yes', 'No'],
                    },
                ]);
                lint = lintTemp === 'Yes';
            } else {
                lint = !!lintOption;
            }
        }

        let cli,
            cliOption = toolbox.parameters.options.cli;
        if (cliOption === undefined) {
            [cli] = await parse([
                {
                    question: 'CLI',
                    required: true,
                    type: 'radio',
                    choices: ['React Native Community (recommended)', 'Expo'],
                },
            ]);
        } else {
            cli = cliOption;
        }

        let command: string;
        if (cli === 'Expo') {
            command = `npx -p expo-cli expo init --name=${name} --template=${
                language === 'TypeScript' ? 'expo-template-blank-typescript' : 'blank'
            } "${name}"`;
        } else {
            command = `npx react-native init ${name} ${
                language === 'TypeScript' ? '--template react-native-template-typescript' : ''
            }`;
        }

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React Native project in ${timer() / 1000} seconds`);

        return { name, language, lint, cli: cli === 'Expo' ? 'Expo' : 'RNC' };
    };

    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        ionic: createIonicProject,
        reactNative: createReactNativeProject,
    };
};
