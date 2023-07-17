/*
 * This file includes utilities for creating new skeleton projects in any framework using
 * the associated CLIs via npx.
 */
import { GluegunToolbox } from 'gluegun';
import { NPM7_PREFIX, QUESTIONS } from '../constants';
import { AngularProps, ReactProps, ReactNativeProps, Template, getVersionString } from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, parse, print } = toolbox;
    const { options } = toolbox.parameters;

    const createAngularProject = async (): Promise<AngularProps> => {
        const [name, template, lint, prettier]: [string, string, boolean, boolean] = await parse([
            QUESTIONS.name,
            QUESTIONS.template,
            QUESTIONS.lint,
            QUESTIONS.prettier,
        ]);

        const command = `${NPM7_PREFIX} && npx -p @angular/cli@^15.2.0 ng new ${name} --directory "${name}" --style=scss`;
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

        // Choose a name & template
        const [name, template]: [string, Template] = await parse([QUESTIONS.name, QUESTIONS.seedUItemplate]);
        const isLocal = template.startsWith('file:');

        // Choose code formatting options
        [lint] = await parse([QUESTIONS.lint]);
        const [prettier]: [boolean] = await parse([QUESTIONS.prettier]);

        // determine the version of the template to use (--alpha, --beta, or explicit --template=name@x.x.x)
        const [templateNameParam, versionString] = getVersionString(options, template);

        // Map the template selection to template name
        let templateName = '';
        switch (templateNameParam.toLocaleLowerCase()) {
            case 'basic routing':
            case 'routing': // to allow for --template=routing instead of --template="basic routing"
                templateName = '@brightlayer-ui/routing-typescript';
                break;
            case 'authentication':
                templateName = '@brightlayer-ui/authentication-typescript';
                break;
            case 'blank':
                templateName = '@brightlayer-ui/blank-typescript';
                break;
            case 'seed ui':
                templateName = '@brightlayer-ui/seedui-typescript';
                break;
            default:
                // allow users to specify a local file to test
                if (isLocal) {
                    templateName = templateNameParam;
                } else {
                    templateName = '@brightlayer-ui/blank-typescript';
                }
        }

        const command = `${NPM7_PREFIX} && npx create-react-app ${name} --template ${templateName}${versionString}`;

        const spinner = print.spin('Creating a new React project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React project in ${timer() / 1000} seconds`);

        return { name, lint, prettier };
    };

    const createReactNativeProject = async (): Promise<ReactNativeProps> => {
        // Choose a name
        const [name]: [string] = await parse([QUESTIONS.name]);

        // Choose a template
        let template = '';
        [template] = await parse([QUESTIONS.template]);

        // Choose code formatting options
        let lint = true;
        [lint] = await parse([QUESTIONS.lint]);
        const [prettier] = await parse([QUESTIONS.prettier]);

        // Create the basic project
        const command = `${NPM7_PREFIX} && npx react-native init ${name} --template react-native-template-typescript`;

        const spinner = print.spin('Creating a new React Native project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created skeleton React Native project in ${timer() / 1000} seconds`);

        return { name, lint, prettier, template };
    };

    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        reactNative: createReactNativeProject,
    };
};
