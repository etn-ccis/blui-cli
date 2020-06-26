/*
 * This file includes utilities for adding PX Blue to a skeleton project.
 */
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
    PRETTIER_DEPENDENCIES,
    PRETTIER_SCRIPTS,
    PRETTIER_CONFIG,
} from '../constants';
import {
    updateScripts,
    updateBrowsersListFile,
    updateBrowsersListJson,
    AngularProps,
    ReactProps,
    ReactNativeProps,
} from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { print, fancyPrint, system, fileModify } = toolbox;

    const printSuccess = (project: string): void => {
        print.info('');
        fancyPrint.divider('•', 60);
        fancyPrint.info('', '•', 60, 10);
        fancyPrint.info('PX Blue integration complete', '•', 60, 10);
        fancyPrint.info('Your project:', '•', 60, 10);
        fancyPrint.info(`${project}`, '•', 60, 10);
        fancyPrint.info('has been created successfully!', '•', 60, 10);
        fancyPrint.info('', '•', 60, 10);
        fancyPrint.divider('•', 60);
    };
    const printInstructions = (instructions: string[]): void => {
        fancyPrint.divider('•', 60);
        fancyPrint.info('', '•', 60, 10);
        fancyPrint.infoLeft(`To run your project:`, '•', 60, 10);
        fancyPrint.info('', '•', 60, 10);
        instructions.forEach((instruction) => fancyPrint.infoLeft(instruction, '•', 60, 10));
        fancyPrint.info('', '•', 60, 10);
        fancyPrint.divider('•', 60);
        print.info('');
    };

    const addPXBlueAngular = async (props: AngularProps): Promise<void> => {
        const { name, lint, prettier } = props;
        const folder = `./${name}`;
        const isYarn = filesystem.exists(`./${folder}/yarn.lock`) === 'file';

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.angular,
            dev: false,
            description: 'PX Blue Angular Dependencies',
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.angular,
            dev: true,
            description: 'PX Blue Angular Dev Dependencies',
        });

        // Install ESLint Packages (optional)
        if (lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.angular,
                dev: true,
                description: 'PX Blue ESLint Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts,
            });
        }

        // Install Code Formatting Packages (optional)
        if (prettier) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: PRETTIER_DEPENDENCIES.angular,
                dev: true,
                description: 'PX Blue Prettier Packages',
            });
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(lint ? LINT_SCRIPTS.angular : []));
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(prettier ? PRETTIER_SCRIPTS.angular : []));
        if (prettier) packageJSON.prettier = '@pxblue/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update browsers list
        let browsers = filesystem.read(`${folder}/browserslist`, 'utf8');
        browsers = updateBrowsersListFile(browsers);
        filesystem.write(`${folder}/browserslist`, browsers);

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html
            .replace(
                /<title>.+<\/title>/gi,
                `<title>${name}</title>\r\n\t<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`
            )
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

        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 4 });

        // Update styles.scss
        filesystem.remove(`${folder}/src/styles.scss`);
        filesystem.write(`${folder}/src/styles.scss`, STYLES);

        spinner.stop();

        printSuccess(name);
        printInstructions([`cd ${name}`, `${isYarn ? 'yarn' : 'npm'} start --open`]);
    };

    const addPXBlueReact = async (props: ReactProps): Promise<void> => {
        const { name, lint, prettier, language } = props;
        const folder = `./${name}`;
        const ts = language === 'ts';
        const isYarn = filesystem.exists(`./${folder}/yarn.lock`) === 'file';

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.react,
            dev: false,
            description: 'PX Blue React Dependencies',
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.react,
            dev: true,
            description: 'PX Blue React Dev Dependencies',
        });

        // Install ESLint Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.react,
                dev: true,
                description: 'PX Blue ESLint Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.tsx,
            });

            let serviceWorker = filesystem.read(`${folder}/src/serviceWorker.ts`);
            serviceWorker = `/* eslint-disable */\r\n${serviceWorker}`;
            filesystem.write(`${folder}/src/serviceWorker.ts`, serviceWorker);
        }

        // Install Code Formatting Packages (optional)
        if (prettier) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: PRETTIER_DEPENDENCIES.react,
                dev: true,
                description: 'PX Blue Prettier Packages',
            });
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.react.concat(lint && ts ? LINT_SCRIPTS.react : []));
        packageJSON = updateScripts(packageJSON, SCRIPTS.react.concat(prettier ? PRETTIER_SCRIPTS.react : []));
        packageJSON = updateBrowsersListJson(packageJSON);
        if (prettier) packageJSON.prettier = '@pxblue/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.css
        filesystem.remove(`${folder}/src/index.css`);
        filesystem.write(`${folder}/src/index.css`, STYLES);

        // Update index.js/tsx
        let index = filesystem.read(`${folder}/src/index.${!ts ? 'js' : 'tsx'}`, 'utf8');
        const imports = ROOT_IMPORTS.react.join('\r\n');
        index = `import 'react-app-polyfill/ie11';\r\nimport 'react-app-polyfill/stable';\r\n${index}`
            .replace("'./serviceWorker';", `'./serviceWorker';\r\n${imports}\r\n`)
            .replace('<App />', ROOT_COMPONENT.react);
        filesystem.write(`${folder}/src/index.${!ts ? 'js' : 'tsx'}`, index);

        // Update index.html
        let html = filesystem.read(`${folder}/public/index.html`, 'utf8');
        html = html.replace(/<title>.*<\/title>/gi, `<title>${name}</title>`);
        filesystem.write(`${folder}/public/index.html`, html);

        spinner.stop();
        printSuccess(name);
        printInstructions([`cd ${name}`, `${isYarn ? 'yarn' : 'npm'} start`]);
    };

    const addPXBlueIonic = async (props: AngularProps): Promise<void> => {
        const { name, lint, prettier } = props;
        const folder = `./${name}`;

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.ionic,
            dev: false,
            description: 'PX Blue Ionic Dependencies',
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.ionic,
            dev: true,
            description: 'PX Blue Ionic Dev Dependencies',
        });

        // Install ESLint Packages (optional)
        if (lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.ionic,
                dev: true,
                description: 'PX Blue ESLint Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts,
            });
        }

        // Install Code Formatting Packages (optional)
        if (prettier) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: PRETTIER_DEPENDENCIES.ionic,
                dev: true,
                description: 'PX Blue Prettier Packages',
            });
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.ionic.concat(lint ? LINT_SCRIPTS.ionic : []));
        packageJSON = updateScripts(packageJSON, SCRIPTS.ionic.concat(prettier ? PRETTIER_SCRIPTS.ionic : []));
        if (prettier) packageJSON.prettier = '@pxblue/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html
            .replace(
                /<title>.+<\/title>/gi,
                `<title>${name}</title>\r\n\t<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`
            )
            .replace(/<app-root>.*<\/app-root>/gi, ROOT_COMPONENT.ionic);
        filesystem.write(`${folder}/src/index.html`, html);

        // Update angular.json
        const angularJSON: any = filesystem.read(`${folder}/angular.json`, 'json');
        const styles = [
            { input: 'src/theme/variables.scss' },
            { input: 'src/global.scss' },
            { input: './node_modules/@pxblue/angular-themes/theme.scss' },
            { input: './node_modules/typeface-open-sans' },
        ];
        angularJSON.projects.app.architect.build.options.styles = styles;
        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 4 });

        spinner.stop();
        printSuccess(name);
        printInstructions([`cd ${name}`, `ionic serve`]);
    };

    const addPXBlueReactNative = async (props: ReactNativeProps): Promise<void> => {
        const { name, lint, prettier, language, cli } = props;
        const folder = `./${name}`;
        const ts = language === 'ts';
        const expo = cli === 'expo';
        const isYarn = filesystem.exists(`./${folder}/yarn.lock`) === 'file';

        let command: string;

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.reactNative.concat(expo ? ['@use-expo/font'] : []),
            dev: false,
            description: 'PX Blue React Native Dependencies',
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.reactNative.concat(expo ? ['jest-expo'] : []),
            dev: true,
            description: 'PX Blue React Native Dev Dependencies',
        });

        // Install ESLint Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.reactNative,
                dev: true,
                description: 'PX Blue ESLint Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.tsx,
            });
        }

        // Install Code Formatting Packages (optional)
        if (prettier) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: PRETTIER_DEPENDENCIES.reactNative,
                dev: true,
                description: 'PX Blue Prettier Packages',
            });
            filesystem.write(`${folder}/.prettierignore`, `ios/\r\nandroid\r\n`);
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.reactNative.concat(lint && ts ? LINT_SCRIPTS.reactNative : []));
        packageJSON = updateScripts(packageJSON, SCRIPTS.reactNative.concat(prettier ? PRETTIER_SCRIPTS.reactNative : []));
        if (prettier && ts) packageJSON.prettier = '@pxblue/prettier-config';
        packageJSON.scripts.test = 'jest';
        if (!expo) packageJSON.scripts.rnlink = 'react-native link';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update prettier.rc for JS projects
        if(!ts && prettier){
            filesystem.write(`${folder}/.prettierrc.js`, PRETTIER_CONFIG.rc);
        }

        // Clone the helpers repo
        const helper = `cli-helpers-${Date.now()}`;
        command = `git clone https://github.com/pxblue/cli-helpers ${helper}`;
        await system.run(command);

        // Copy the fonts
        filesystem.dir(`./${folder}/assets`);
        filesystem.copy(`./${helper}/fonts`, `${folder}/assets/fonts`, { overwrite: true });

        // Link native modules
        if (!expo) {
            filesystem.copy(`./${helper}/react-native/rnc/react-native.config.js`, `${folder}/react-native.config.js`, {
                overwrite: true,
            });
            command = `cd ${folder} && ${isYarn ? 'yarn' : 'npm run'} rnlink`;
            await system.run(command);
        }

        // Copy the App template with ThemeProvider (TODO: replace template with instruction insertion)
        filesystem.copy(
            `./${helper}/react-native/${cli}/App.${ts ? 'tsx' : 'js'}`,
            `${folder}/App.${ts ? 'tsx' : 'js'}`,
            { overwrite: true }
        );

        // Remove the temporary folder
        filesystem.remove(`./${helper}`);

        spinner.stop();
        printSuccess(name);
        printInstructions(
            !expo
                ? [
                      `iOS:`,
                      `• cd ${name}/ios`,
                      `• pod install`,
                      `• cd ..`,
                      `• ${isYarn ? 'yarn' : 'npm run'} ios`,
                      ``,
                      `Android:`,
                      `• Have an Android emulator running`,
                      `• ${isYarn ? 'yarn' : 'npm run'} android`,
                  ]
                : [`cd ${name}`, `${isYarn ? 'yarn' : 'npm'} start`]
        );
        if (!expo)
            print.warning(
                'Before running your project on iOS, you may need to open xCode and remove the react-native-vector-icons fonts from the "Copy Bundle Resources" step in Build Phases (refer to https://github.com/oblador/react-native-vector-icons/issues/1074).'
            );
        print.info('');
    };

    toolbox.addPXBlue = {
        angular: addPXBlueAngular,
        react: addPXBlueReact,
        ionic: addPXBlueIonic,
        reactNative: addPXBlueReactNative,
    };
};
