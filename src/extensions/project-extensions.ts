/*
 * This file includes utilities for creating new skeleton projects in any framework using
 * the associated CLIs via npx.
 */
import { GluegunToolbox } from 'gluegun';
import { QUESTIONS } from '../constants';
import { assignJsTs, stringToLowerCaseNoSpace, Cli, AngularProps, ReactProps, ReactNativeProps } from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, parse, print } = toolbox;

    const createAngularProject = async (): Promise<AngularProps> => {
        const [name, lint]: [string, boolean] = await parse([QUESTIONS.name, QUESTIONS.lint]);

        const command = `npx -p @angular/cli ng new ${name} --directory "${name}" --style=scss`;

        const spinner = print.spin('Creating a new Angular project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Angular project in ${timer() / 1000} seconds`);

        return { name, lint };
    };

    const createReactProject = async (): Promise<ReactProps> => {
        let lint = true;

        const [name]: [string] = await parse([QUESTIONS.name]);

        const [languageTemp]: [string] = await parse([QUESTIONS.language]);
        const language = assignJsTs(languageTemp);
        const isTs = language === 'ts';

        if (isTs) {
            [lint] = await parse([QUESTIONS.lint]);
        }

        const command = `npx create-react-app ${name} ${isTs ? '--template typescript' : ''}`;

        const spinner = print.spin('Creating a new React project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React project in ${timer() / 1000} seconds`);

        return { name, language, lint };
    };

    const createIonicProject = async (): Promise<AngularProps> => {
        const [name, lint]: [string, boolean] = await parse([QUESTIONS.name, QUESTIONS.lint]);

        const command = `npx ionic start ${name} blank`;

        const spinner = print.spin('Creating a new Ionic project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Ionic project in ${timer() / 1000} seconds`);

        return { name, lint };
    };

    const createReactNativeProject = async (): Promise<ReactNativeProps> => {
        let lint = true;

        const [name]: [string] = await parse([QUESTIONS.name]);

        const [languageTemp]: [string] = await parse([QUESTIONS.language]);
        const language = assignJsTs(languageTemp);
        const isTs = language === 'ts';

        if (isTs) {
            [lint] = await parse([QUESTIONS.lint]);
        }

        let [cliTemp]: [string] = await parse([QUESTIONS.cli]);
        cliTemp = stringToLowerCaseNoSpace(cliTemp);
        const cli: Cli = cliTemp === 'expo' ? 'expo' : 'rnc';

        let command: string;
        if (cli === 'expo') {
            command = `npx -p expo-cli expo init --name=${name} --template=${
                isTs ? 'expo-template-blank-typescript' : 'blank'
            } "${name}"`;
        } else {
            command = `npx react-native init ${name} ${isTs ? '--template react-native-template-typescript' : ''}`;
        }

        const spinner = print.spin('Creating a new React Native project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React Native project in ${timer() / 1000} seconds`);

        return { name, language, lint, cli };
    };

    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        ionic: createIonicProject,
        reactNative: createReactNativeProject,
    };
};
