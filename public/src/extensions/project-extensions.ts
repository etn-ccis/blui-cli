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
        const [name, lint] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Use PX Blue Lint & Prettier configs?', required: true, type: 'radio', choices: ['Yes', 'No'] },
        ]);

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
        let lint = false;
        const [name, language] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
        ]);
        if (language === 'TypeScript') {
            const [lintTemp] = await parse([
                {
                    question: 'Use PX Blue Lint & Prettier configs?',
                    required: true,
                    type: 'radio',
                    choices: ['Yes', 'No'],
                },
            ]);
            lint = lintTemp === 'Yes';
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
        const [name, lint] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Use PX Blue Lint & Prettier configs?', required: true, type: 'radio', choices: ['Yes', 'No'] },
        ]);

        const command = `npx ionic start ${name} blank`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Ionic project in ${timer() / 1000} seconds`);

        return { name, lint: lint === 'Yes' };
    };

    const createReactNativeProject = async (): Promise<NewReactNativeResult> => {
        let lint = false;
        const [name, language, cli] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
            {
                question: 'CLI',
                required: true,
                type: 'radio',
                choices: ['React Native Community (recommended)', 'Expo'],
            },
        ]);
        if (language === 'TypeScript') {
            const [lintTemp] = await parse([
                {
                    question: 'Use PX Blue Lint & Prettier configs?',
                    required: true,
                    type: 'radio',
                    choices: ['Yes', 'No'],
                },
            ]);
            lint = lintTemp === 'Yes';
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
