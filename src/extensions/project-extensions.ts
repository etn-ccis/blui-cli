/*
 * This file includes utilities for creating new skeleton projects in any framework using
 * the associated CLIs via npx.
 */
import { GluegunToolbox } from 'gluegun';
import { QUESTIONS } from '../constants';
import {
    assignJsTs,
    stringToLowerCaseNoSpace,
    Cli,
    AngularProps,
    ReactProps,
    ReactNativeProps,
    Template,
    IonicProps,
} from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, parse, print } = toolbox;

    const createAngularProject = async (): Promise<AngularProps> => {
        const [name, lint, prettier, template]: [string, boolean, boolean, string] = await parse([
            QUESTIONS.name,
            QUESTIONS.lint,
            QUESTIONS.prettier,
            QUESTIONS.template,
        ]);

        const command = `npm_config_yes=true npx -p @angular/cli@^11.0.0 ng new ${name} --directory "${name}" --style=scss`;
        const spinner = print.spin('Creating a new Angular project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);

        spinner.stop();
        print.info(output);
        print.success(`Created skeleton Angular project in ${timer() / 1000} seconds`);
        return { name, lint, prettier, template };
    };

    const createReactProject = async (): Promise<ReactProps> => {
        let lint = true;

        const [name, languageTemp]: [string, string] = await parse([QUESTIONS.name, QUESTIONS.language]);
        const language = assignJsTs(languageTemp);
        const isTs = language === 'ts';

        if (isTs) {
            [lint] = await parse([QUESTIONS.lint]);
        }

        const [prettier, template]: [boolean, Template] = await parse([QUESTIONS.prettier, QUESTIONS.template]);

        // Map the template selection to template name
        let templateName = '';
        switch (template.toLocaleLowerCase()) {
            case 'basic routing':
            case 'routing': // to allow for --template=routing instead of --template="basic routing"
                templateName = isTs ? '@pxblue/routing-typescript' : '@pxblue/routing';
                break;
            case 'authentication':
                templateName = isTs ? '@pxblue/authentication-typescript' : '@pxblue/authentication';
                break;
            case 'blank':
            default:
                templateName = isTs ? '@pxblue/blank-typescript' : '@pxblue/blank';
        }

        const command = `npm_config_yes=true create-react-app ${name} --template ${templateName}`;

        const spinner = print.spin('Creating a new React project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React project in ${timer() / 1000} seconds`);

        return { name, language, lint, prettier };
    };

    const createIonicProject = async (): Promise<IonicProps> => {
        const [name, lint, prettier]: [string, boolean, boolean] = await parse([
            QUESTIONS.name,
            QUESTIONS.lint,
            QUESTIONS.prettier,
        ]);

        const command = `npm_config_yes=true npx ionic start ${name} blank`;

        const spinner = print.spin('Creating a new Ionic project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton Ionic project in ${timer() / 1000} seconds`);

        return { name, lint, prettier };
    };

    const createReactNativeProject = async (): Promise<ReactNativeProps> => {
        let lint = true;

        const [name]: [string] = await parse([QUESTIONS.name]);
        let template = '';

        const [languageTemp]: [string] = await parse([QUESTIONS.language]);
        const language = assignJsTs(languageTemp);
        const isTs = language === 'ts';

        if (isTs) {
            [lint] = await parse([QUESTIONS.lint]);
        }
        const [prettier] = await parse([QUESTIONS.prettier]);

        let [cliTemp]: [string] = await parse([QUESTIONS.cli]);
        cliTemp = stringToLowerCaseNoSpace(cliTemp);
        const cli: Cli = cliTemp === 'expo' ? 'expo' : 'rnc';

        let command: string;
        if (cli === 'expo') {
            command = `npm_config_yes=true npx -p expo-cli expo init --name=${name} --template=${
                isTs ? 'expo-template-blank-typescript' : 'blank'
            } "${name}"`;
        } else {
            command = `npm_config_yes=true npx react-native init ${name} ${isTs ? '--template react-native-template-typescript' : ''}`;
        }

        if (cli !== 'expo') {
            [template] = await parse([QUESTIONS.template]);
        }

        const spinner = print.spin('Creating a new React Native project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React Native project in ${timer() / 1000} seconds`);

        return { name, language, lint, prettier, cli, template };
    };

    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        ionic: createIonicProject,
        reactNative: createReactNativeProject,
    };
};
