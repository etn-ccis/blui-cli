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
} from '../constants';
import { updateScripts, updateBrowsersListFile, updateBrowsersListJson } from '../utilities';

type AddAngularProps = {
    name: string;
    lint: boolean;
};
type AddReactProps = {
    name: string;
    language: 'TypeScript' | 'JavaScript';
    lint: boolean;
};

module.exports = (toolbox: GluegunToolbox): void => {
    const { print, system, fileModify } = toolbox;

    const addPXBlueAngular = async (props: AddAngularProps): Promise<void> => {
        const { name, lint } = props;
        const folder = `./${name}`;

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

        // Install Code Standard Packages (optional)
        if (lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.angular,
                dev: true,
                description: 'PX Blue Code Standard Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts,
            });
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

        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 4 });

        // Update styles.scss
        filesystem.remove(`${folder}/src/styles.scss`);
        filesystem.write(`${folder}/src/styles.scss`, STYLES);

        spinner.stop();
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    };

    const addPXBlueReact = async (props: AddReactProps): Promise<void> => {
        const { name, lint, language } = props;
        const folder = `./${name}`;
        const ts = language === 'TypeScript';

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

        // Install Code Standard Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.react,
                dev: true,
                description: 'PX Blue Code Standard Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.tsx,
            });

            let serviceWorker = filesystem.read(`${folder}/src/serviceWorker.ts`);
            serviceWorker = `/* eslint-disable */\r\n${serviceWorker}`;
            filesystem.write(`${folder}/src/serviceWorker.ts`, serviceWorker);
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.react.concat(lint ? LINT_SCRIPTS.react : []));
        packageJSON = updateBrowsersListJson(packageJSON);
        if (lint) packageJSON.prettier = '@pxblue/prettier-config';
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
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    };

    const addPXBlueIonic = async (props: AddAngularProps): Promise<void> => {
        const { name, lint } = props;
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

        // Install Code Standard Packages (optional)
        if (lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.ionic,
                dev: true,
                description: 'PX Blue Code Standard Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts,
            });
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.ionic.concat(lint ? LINT_SCRIPTS.ionic : []));
        if (lint) packageJSON.prettier = '@pxblue/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html
            .replace(/<title>.+<\/title>/gi, `<title>${name}</title>`)
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
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    };

    const addPXBlueReactNative = async (props: AddReactProps): Promise<void> => {
        const { name, lint, language } = props;
        const folder = `./${name}`;
        const ts = language === 'TypeScript';

        // Install Dependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEPENDENCIES.reactNative,
            dev: false,
            description: 'PX Blue React Native Dependencies',
        });

        // Install DevDependencies
        await fileModify.installDependencies({
            folder: folder,
            dependencies: DEV_DEPENDENCIES.reactNative,
            dev: true,
            description: 'PX Blue React Native Dev Dependencies',
        });

        // Install Code Standard Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.reactNative,
                dev: true,
                description: 'PX Blue Code Standard Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.tsx,
            });
            filesystem.write(`${folder}/.prettierignore`, `ios/\r\nandroid\r\n`);
        }

        // Final Steps: browser support, styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Install pods
        const command = `cd ${folder}/ios && pod install`;
        const output = await system.run(command);
        print.info(output);

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.reactNative.concat(lint ? LINT_SCRIPTS.reactNative : []));
        if (lint) packageJSON.prettier = '@pxblue/prettier-config';
        packageJSON.scripts.test = 'jest';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        spinner.stop();
        print.success(`PX Blue integration completed successfully. Your project (${name}) is ready to run!`);
    };

    toolbox.addPXBlue = {
        angular: addPXBlueAngular,
        react: addPXBlueReact,
        ionic: addPXBlueIonic,
        reactNative: addPXBlueReactNative,
    };
};
