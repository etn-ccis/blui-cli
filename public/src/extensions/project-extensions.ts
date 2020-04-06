import { GluegunToolbox, filesystem } from 'gluegun';
import {
    DEPENDENCIES,
    DEV_DEPENDENCIES,
    LINT_DEPENDENCIES,
    LINT_SCRIPTS,
    LINT_CONFIG,
    SCRIPTS,
    ROOT_COMPONENT,
    STYLES,
    ROOT_IMPORTS,
} from '../constants';
import { updateScripts, updateBrowsersListFile, updateBrowsersListJson } from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, parse, print, fileModify } = toolbox;

   /* 
     *
     * Add PX Blue integrations to skeleton projects
     * 
    */
   type AddAngularProps = {
       name: string;
       lint: boolean;
   }
    const addPXBlueAngular = async (props: AddAngularProps): Promise<void> => {
        const {name, lint} = props;
        const folder = `./${name}`;

        // Install Dependencies
        fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.angular,
            dev: false,
            description: 'PX Blue Angular Dependencies'
        });

        // Install DevDependencies
        fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.angular,
            dev: true,
            description: 'PX Blue Angular Dev Dependencies'
        });

        // Install Code Standard Packages (optional)
        if (lint) {
            fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.angular,
                dev: false,
                description: 'PX Blue Code Standard Packages'
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts
            })
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');
        
        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(lint ? LINT_SCRIPTS.angular : []));
        if (lint) packageJSON.prettier = '@pxblue/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });
        
        // Update browsers list
        let browsers = filesystem.read(`${folder}/browserslist`, 'utf8');
        browsers = updateBrowsersListFile(browsers);
        filesystem.write(`${folder}/browserslist`, browsers);

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html
            .replace(/<title>.+<\/title>/gi, `<title>${name}</title>`)
            .replace(/<app-root>.*<\/app-root>/gi, ROOT_COMPONENT.angular);
        filesystem.write(`${folder}/src/index.html`, html);

        // Update angular.json
        const angularJSON: any = filesystem.read(`${folder}/angular.json`, 'json');
        const styles = [
            'src/styles.scss',
            './node_modules/@pxblue/angular-themes/theme.scss',
            './node_modules/typeface-open-sans',
        ];
        angularJSON.projects[name].architect.build.options.styles = styles;
        angularJSON.projects[name].architect.test.options.styles = styles;

        // make it work for ie11
        angularJSON.projects[name].architect.build.configurations['es5'] = { tsConfig: './tsconfig.es5.json' };
        angularJSON.projects[name].architect.serve.configurations['es5'] = { browserTarget: `${name}:build:es5` };
        filesystem.write(
            `${folder}/tsconfig.es5.json`,
            `{\r\n\t"extends": "./tsconfig.json",\r\n\t"compilerOptions": {\r\n\t\t"target": "es5"\r\n\t}\r\n}`
        );

        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 2 });

        // Update styles.scss
        filesystem.remove(`${folder}/src/styles.scss`);
        filesystem.write(`${folder}/src/styles.scss`, STYLES);

        spinner.stop();
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    };

    type AddReactProps = {
        name: string;
        language: 'TypeScript' | 'JavaScript';
        lint: boolean;
    }
    const addPXBlueReact = async (props: AddReactProps): Promise<void> => {
        const { name, lint, language } = props;
        const folder = `./${name}`;
        const ts = language === 'TypeScript';

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.react,
            dev: false,
            description: 'PX Blue React Dependencies'
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.react,
            dev: true,
            description: 'PX Blue React Dev Dependencies'
        });

        // Install Code Standard Packages (optional)
        if (language === 'TypeScript' && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.react,
                dev: false,
                description: 'PX Blue Code Standard Packages'
            });
            await fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.tsx,
            })

            let serviceWorker = filesystem.read(`${folder}/src/serviceWorker.ts`);
            serviceWorker = '/* eslint-disable */\r\n' + serviceWorker;
            filesystem.write(`${folder}/src/serviceWorker.ts`, serviceWorker);
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.react.concat(lint ? LINT_SCRIPTS.react : []));
        packageJSON = updateBrowsersListJson(packageJSON);
        packageJSON.prettier = "@pxblue/prettier-config";
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.css
        filesystem.remove(`${folder}/src/index.css`);
        filesystem.write(`${folder}/src/index.css`, STYLES);

        // Update index.js/tsx
        let index = filesystem.read(`${folder}/src/index.${!ts ? 'js' : 'tsx'}`, 'utf8');
        let imports = ROOT_IMPORTS.react.join('\r\n');
        index = (`import 'react-app-polyfill/ie11';\r\nimport 'react-app-polyfill/stable';\r\n` + index)
            .replace('\'./serviceWorker\';', '\'./serviceWorker\';\r\n' + imports + '\r\n')
            .replace('<App />', ROOT_COMPONENT.react);
        filesystem.write(`${folder}/src/index.${!ts ? 'js' : 'tsx'}`, index);

        // Update index.html
        let html = filesystem.read(`${folder}/public/index.html`, 'utf8');
        html = html.replace(/<title>.*<\/title>/ig, `<title>${name}</title>`);
        filesystem.write(`${folder}/public/index.html`, html);

        spinner.stop();
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    }



    /* 
     *
     * Create Basic CLI skeleton projects
     * 
    */
    const createAngularProject = async (): Promise<void> => {
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
        print.success(`Created Angular project (${name}) in ${timer() / 1000} seconds`);

        await addPXBlueAngular({name, lint: lint === 'Yes'});
    };

    const createReactProject = async (): Promise<void> => {
        let lint = false;
        const [name, language] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
        ]);
        if (language === 'TypeScript') {
            const [lintTemp] = await parse([
                { question: 'Use PX Blue Lint & Prettier configs?', required: true, type: 'radio', choices: ['Yes', 'No'] },
            ]);
            lint = lintTemp === 'Yes';
        }

        const command = `npx create-react-app ${name} ${language === 'TypeScript' ? '--template typescript' : ''}`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created React project (${name}) in ${timer() / 1000} seconds`);

        await addPXBlueReact({name, language, lint});
    };

    const createIonicProject = async (): Promise<void> => {
        const [name] = await parse([{ question: 'Project Name', required: true }]);

        const command = `npx ionic start ${name} blank`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created Ionic project (${name}) in ${timer() / 1000} seconds`);
    };

    const createReactNativeProject = async (): Promise<void> => {
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
        print.success(`Created React Native project (${name}) in ${timer() / 1000} seconds`);
    };



    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        ionic: createIonicProject,
        reactNative: createReactNativeProject,
    };
};
