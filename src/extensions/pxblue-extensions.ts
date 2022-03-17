/*
 * This file includes utilities for adding Brightlayer UI to a skeleton project.
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
    PRETTIER_DEPENDENCIES,
    PRETTIER_SCRIPTS,
    PRETTIER_CONFIG,
    NPM7_PREFIX,
} from '../constants';
import { JEST } from '../constants/jest';
import {
    updateScripts,
    updateBrowsersListFile,
    updateBrowsersListJson,
    AngularProps,
    ReactProps,
    ReactNativeProps,
    getVersionString,
} from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const { print, fancyPrint, system, fileModify } = toolbox;
    const { options } = toolbox.parameters;

    const printSuccess = (project: string): void => {
        print.info('');
        fancyPrint.divider('•', 60);
        fancyPrint.info('', '•', 60, 10);
        fancyPrint.info('Brightlayer UI integration complete', '•', 60, 10);
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

    const addBLUIAngular = async (props: AngularProps): Promise<void> => {
        const { name, lint, prettier, template } = props;
        const folder = `./${name}`;

        const pathInFolder = (filename: string): string => filesystem.path(folder, filename);

        const isYarn = filesystem.exists(pathInFolder('yarn.lock')) === 'file';

        let templateSpinner = print.spin('Starting Brightlayer UI integration...');
        templateSpinner.stop(); // Start and stop the spinner to automatically infer the type instead of using any

        // determine the version of the template to use (--alpha, --beta, or explicit --template=name@x.x.x)
        const [templateNameParam, versionString] = getVersionString(options, template);
        const isLocal = templateNameParam.startsWith('file:');

        // Map the template selection to template src
        let templatePackage = '';
        switch (templateNameParam.toLocaleLowerCase()) {
            case 'basic routing':
            case 'routing':
                templatePackage = '@brightlayer-ui/angular-template-routing';
                break;
            case 'authentication':
                templatePackage = '@brightlayer-ui/angular-template-authentication';
                break;
            case 'blank':
                templatePackage = '@brightlayer-ui/angular-template-blank';
                break;
            default:
                // allow users to specify a local file to test
                templatePackage = isLocal ? templateNameParam : '@brightlayer-ui/angular-template-blank';
        }

        // Clone the template repo (if applicable)
        templateSpinner = print.spin('Adding Brightlayer UI template...');
        const templateFolder = `template-${new Date().getTime()}`;
        const command = isLocal
            ? `echo "Using Local Template"`
            : `cd ${name} && npm install ${templatePackage}${versionString} --prefix ${templateFolder}`;
        await system.run(command);

        // identify where to copy files from — local file or npm folder
        const templatePath = isLocal
            ? templatePackage.replace('file:', '')
            : `./${name}/${templateFolder}/node_modules/${templatePackage}`;

        // Copy the selected template from the repo
        filesystem.copy(`${templatePath}/template`, `./${name}/src/app/`, {
            overwrite: true,
        });
        // Copy template-specific assets from the repo (if exists)
        if (filesystem.isDirectory(`${templatePath}/assets`)) {
            filesystem.copy(`${templatePath}/assets`, `./${name}/src/assets/`, {
                overwrite: true,
            });
        }

        // Install template-specific dependencies
        const dependencies = filesystem.read(`${templatePath}/template-dependencies.json`, 'json').dependencies;
        await fileModify.installDependencies({
            folder: folder,
            dependencies,
            dev: false,
            description: 'Brightlayer UI Template Dependencies',
        });

        // Install template-specific dev-dependencies
        const devDependencies = filesystem.read(`${templatePath}/template-dependencies.json`, 'json').devDependencies;
        await fileModify.installDependencies({
            folder: folder,
            dependencies: devDependencies,
            dev: true,
            description: 'Brightlayer UI Template DevDependencies',
        });

        // Remove the template package folder
        filesystem.remove(`./${name}/${templateFolder}`);
        templateSpinner.stop();

        // Install ESLint Packages (optional)
        if (lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.angular,
                dev: true,
                description: 'Brightlayer UI ESLint Packages',
            });
            fileModify.addLintConfig({
                folder: folder,
                config: LINT_CONFIG.ts,
            });

            // Remove all tslint configurations
            if (filesystem.exists(pathInFolder('tslint.json'))) {
                templateSpinner = print.spin('Removing tslint dependencies...');
                // remove tslint.json
                filesystem.remove(pathInFolder('tslint.json'));

                // uninstall tslint
                let output = '';
                if (isYarn) {
                    output = await system.run(`cd ${folder} && yarn remove tslint`);
                } else {
                    output = await system.run(`cd ${folder} && npm uninstall tslint`);
                }
                print.info(output);

                // remove lint attribute in angular.json
                if (filesystem.exists(pathInFolder('angular.json'))) {
                    const angularJSON = filesystem.read(pathInFolder('angular.json'), 'json');
                    delete angularJSON.projects[name].architect.lint;
                    filesystem.write(pathInFolder('angular.json'), JSON.stringify(angularJSON, null, 4));
                }
                templateSpinner.stop();
            }
        }

        // Install Code Formatting Packages (optional)
        if (prettier) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: PRETTIER_DEPENDENCIES.angular,
                dev: true,
                description: 'Brightlayer UI Prettier Packages',
            });
        }

        // Final Steps: browser support, styles, theme integration
        templateSpinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(lint ? LINT_SCRIPTS.angular : []));
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(prettier ? PRETTIER_SCRIPTS.angular : []));
        if (prettier) packageJSON.prettier = '@brightlayer-ui/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update tsconfig.json
        const tsconfigJSON: any = {
            compileOnSave: false,
            compilerOptions: {
                baseUrl: './',
                outDir: './dist/out-tsc',
                sourceMap: true,
                declaration: false,
                downlevelIteration: true,
                experimentalDecorators: true,
                moduleResolution: 'node',
                importHelpers: true,
                target: 'es2015',
                module: 'es2020',
                lib: ['es2018', 'dom'],
            },
        };
        filesystem.write(`${folder}/tsconfig.json`, tsconfigJSON, { jsonIndent: 4 });

        // Update browsers list
        let browsers = filesystem.read(`${folder}/.browserslistrc`, 'utf8');
        browsers = updateBrowsersListFile(browsers);
        filesystem.write(`${folder}/.browserslistrc`, browsers);

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html
            .replace(
                /<title>.+<\/title>/gi,
                `<title>${name}</title>\r\n\t<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />`
            )
            .replace(/<body>/gi, ROOT_COMPONENT.angular);
        filesystem.write(`${folder}/src/index.html`, html);

        // Update angular.json
        const angularJSON: any = filesystem.read(`${folder}/angular.json`, 'json');
        const styles = [
            'src/styles.scss',
            './node_modules/@brightlayer-ui/angular-themes/theme.scss',
            './node_modules/@brightlayer-ui/angular-themes/open-sans.scss',
        ];
        const budgets = [
            {
                type: 'initial',
                maximumWarning: '1.5mb',
                maximumError: '2mb',
            },
        ];
        angularJSON.projects[name].architect.build.options.styles = styles;
        angularJSON.projects[name].architect.test.options.styles = styles;
        angularJSON.projects[name].architect.build.configurations.production.budgets = budgets;

        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 4 });

        // Update styles.scss
        filesystem.remove(`${folder}/src/styles.scss`);
        filesystem.write(`${folder}/src/styles.scss`, STYLES);

        templateSpinner.stop();

        printSuccess(name);
        printInstructions([`cd ${name}`, `${isYarn ? 'yarn' : 'npm'} start`]);
    };

    const addBLUIReact = async (props: ReactProps): Promise<void> => {
        const { name, lint, prettier, language } = props;
        const folder = `./${name}`;
        const ts = language === 'ts';
        const isYarn = filesystem.exists(`./${folder}/yarn.lock`) === 'file';

        // Install ESLint Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.react,
                dev: true,
                description: 'Brightlayer UI ESLint Packages',
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
                dependencies: PRETTIER_DEPENDENCIES.react,
                dev: true,
                description: 'Brightlayer UI Prettier Packages',
            });
        }

        // Final Steps: lint and prettier scripts (if applicable) and app title
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, lint && ts ? LINT_SCRIPTS.react : []);
        packageJSON = updateScripts(packageJSON, prettier ? PRETTIER_SCRIPTS.react : []);
        packageJSON = updateBrowsersListJson(packageJSON);
        if (prettier) packageJSON.prettier = '@brightlayer-ui/prettier-config';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.html
        let html = filesystem.read(`${folder}/public/index.html`, 'utf8');
        html = html.replace(/<title>.*<\/title>/gi, `<title>${name}</title>`);
        filesystem.write(`${folder}/public/index.html`, html);

        spinner.stop();
        printSuccess(name);
        printInstructions([`cd ${name}`, `${isYarn ? 'yarn' : 'npm'} start`]);
    };

    const addBLUIReactNative = async (props: ReactNativeProps): Promise<void> => {
        const { name, lint, prettier, language, cli, template } = props;
        const folder = `./${name}`;
        const ts = language === 'ts';
        const expo = cli === 'expo';
        const isYarn = filesystem.exists(`./${folder}/yarn.lock`) === 'file';

        // Set up the template for non-expo projects
        if (!expo) {
            // determine the version of the template to use (--alpha, --beta, or explicit --template=name@x.x.x)
            const [templateNameParam, versionString] = getVersionString(options, template);
            const isLocal = templateNameParam.startsWith('file:');

            // Map the template selection to template src
            let templatePackage = '';
            switch (templateNameParam.toLocaleLowerCase()) {
                case 'basic routing':
                case 'routing':
                    templatePackage = ts
                        ? '@brightlayer-ui/react-native-template-routing-typescript'
                        : '@brightlayer-ui/react-native-template-routing';
                    break;
                case 'authentication':
                    templatePackage = ts
                        ? '@brightlayer-ui/react-native-template-authentication-typescript'
                        : '@brightlayer-ui/react-native-template-authentication';
                    break;
                case 'blank':
                    templatePackage = ts
                        ? '@brightlayer-ui/react-native-template-blank-typescript'
                        : '@brightlayer-ui/react-native-template-blank';
                    break;
                default:
                    // allow users to specify a local file to test
                    templatePackage = isLocal
                        ? templateNameParam
                        : ts
                        ? '@brightlayer-ui/react-native-template-blank-typescript'
                        : '@brightlayer-ui/react-native-template-blank';
            }

            // Clone the template repo (if applicable)
            const templateSpinner = print.spin('Adding Brightlayer UI template...');
            const templateFolder = `template-${new Date().getTime()}`;
            const installTemplateCommand = isLocal
                ? `echo "Using Local Template"`
                : `cd ${name} && npm install ${templatePackage}${versionString} --prefix ${templateFolder} && cd ..`;
            await system.run(installTemplateCommand);

            // Uncomment this line to fake npm install from local file — this will work as long as you run the blui new command from a folder that contains the react-native-cli-templates repository
            // filesystem.copy(`./react-native-cli-templates/${templatePackage.replace('@brightlayer-ui/react-native-template-', '')}`, `./${name}/${templateFolder}/node_modules/${templatePackage}`, {
            //     overwrite: true,
            // });

            const templatePath = isLocal
                ? templatePackage.replace('file:', '')
                : `./${name}/${templateFolder}/node_modules/${templatePackage}`;

            // Copy template files
            filesystem.copy(`${templatePath}/template`, `./${name}/`, {
                overwrite: true,
            });

            // Copy template-specific fonts
            if (filesystem.isDirectory(`${templatePath}/fonts`)) {
                filesystem.copy(`${templatePath}/fonts`, `./${name}/assets/fonts/`, {
                    overwrite: true,
                });
            }

            // Copy template-specific images
            if (filesystem.isDirectory(`${templatePath}/images`)) {
                filesystem.copy(`${templatePath}/images`, `./${name}/assets/images/`, {
                    overwrite: true,
                });
            }

            // Install template-specific dependencies
            const dependencies = filesystem.read(`${templatePath}/dependencies.json`, 'json');
            await fileModify.installDependencies({
                folder: folder,
                dependencies: dependencies.dependencies,
                dev: false,
                description: 'Brightlayer UI Template Dependencies',
            });

            // Install template-specific dev-dependencies
            await fileModify.installDependencies({
                folder: folder,
                dependencies: dependencies.devDependencies,
                dev: true,
                description: 'Brightlayer UI Template DevDependencies',
            });

            // Remove the template package folder
            filesystem.remove(`./${name}/${templateFolder}`);

            // Configure vector icons
            // Update Podfile for iOS
            let podfile = filesystem.read(`./${name}/ios/Podfile`, 'utf8');
            podfile = podfile
                .trim()
                .replace('use_flipper!()', '# use_flipper!()')
                .replace(
                    /end$/gi,
                    `\r\n\r\n\tpod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'\r\n\tpod 'RNBLUIVectorIcons', :path => '../node_modules/@brightlayer-ui/react-native-vector-icons'\r\nend`
                );
            filesystem.write(`./${name}/ios/Podfile`, podfile);

            // Update Info.plist for iOS
            let plist = filesystem.read(`./${name}/ios/${name}/Info.plist`, 'utf8');
            plist = plist.trim().replace(
                /<\/array>/i,
                `</array>
    <key>UIAppFonts</key>
    <array>
        <string>AntDesign.ttf</string>
        <string>Entypo.ttf</string>
        <string>EvilIcons.ttf</string>
        <string>Feather.ttf</string>
        <string>FontAwesome.ttf</string>
        <string>FontAwesome5_Brands.ttf</string>
        <string>FontAwesome5_Regular.ttf</string>
        <string>FontAwesome5_Solid.ttf</string>
        <string>Foundation.ttf</string>
        <string>Ionicons.ttf</string>
        <string>MaterialIcons.ttf</string>
        <string>MaterialCommunityIcons.ttf</string>
        <string>SimpleLineIcons.ttf</string>
        <string>Octicons.ttf</string>
        <string>Zocial.ttf</string>
        <string>Fontisto.ttf</string>
        <string>BLUIIcons.ttf</string>
    </array>`
            );
            filesystem.write(`./${name}/ios/${name}/Info.plist`, plist);

            // Update build.gradle for android
            filesystem.append(
                `./${name}/android/app/build.gradle`,
                `apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"\r\napply from: "../../node_modules/@brightlayer-ui/react-native-vector-icons/fonts.gradle"`
            );

            templateSpinner.stop();
        }
        // End RNC(!expo) block

        if (expo) {
            // Install Dependencies
            await fileModify.installDependencies({
                folder: folder,
                dependencies: DEPENDENCIES.expo.concat(['@expo/metro-config', 'expo-app-loading']),
                dev: false,
                description: 'Brightlayer UI React Native Dependencies',
                expo: true,
            });

            // Install DevDependencies
            await fileModify.installDependencies({
                folder: folder,
                dependencies: DEV_DEPENDENCIES.expo.concat(['jest-expo']),
                dev: true,
                description: 'Brightlayer UI React Native Dev Dependencies',
                expo: true,
            });

            const expoSpinner = print.spin('Configuring Expo files and assets...');

            // Clone the helpers repo
            const helper = `cli-helpers-${Date.now()}`;
            const command = `git clone https://github.com/brightlayer-ui/cli-helpers ${helper}`;
            await system.run(command);

            // Copy the fonts
            filesystem.dir(`./${folder}/assets`);
            filesystem.copy(`./${helper}/fonts`, `${folder}/assets/fonts`, { overwrite: true });

            // Copy the App template with ThemeProvider (TODO: replace template with instruction insertion)
            filesystem.copy(
                `./${helper}/react-native/${cli}/App.${ts ? 'tsx' : 'js'}`,
                `${folder}/App.${ts ? 'tsx' : 'js'}`,
                { overwrite: true }
            );

            // Configure react-native-svg-transformer
            const appJSON: any = filesystem.read(`${folder}/app.json`, 'json');
            const helperAppJSON = filesystem.read(`./${helper}/react-native/expo/app.json`, 'json');
            appJSON.expo.packagerOpts = helperAppJSON.expo.packagerOpts;
            filesystem.write(`${folder}/app.json`, appJSON, { jsonIndent: 4 });

            // Remove the temporary folder
            filesystem.remove(`./${helper}`);
            expoSpinner.stop();
        }
        // End expo block

        // Install ESLint Packages (optional)
        if (ts && lint) {
            await fileModify.installDependencies({
                folder: folder,
                dependencies: LINT_DEPENDENCIES.reactNative,
                dev: true,
                description: 'Brightlayer UI ESLint Packages',
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
                description: 'Brightlayer UI Prettier Packages',
            });
            filesystem.write(`${folder}/.prettierignore`, `ios/\r\nandroid\r\n`);
        }

        // Final Steps: styles, theme integration
        const spinner = print.spin('Performing some final cleanup...');

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(
            packageJSON,
            SCRIPTS.reactNative.concat(lint && ts ? LINT_SCRIPTS.reactNative : [])
        );
        packageJSON = updateScripts(
            packageJSON,
            SCRIPTS.reactNative.concat(prettier ? PRETTIER_SCRIPTS.reactNative : [])
        );
        if (prettier && ts) packageJSON.prettier = '@brightlayer-ui/prettier-config';
        packageJSON.scripts.test = 'jest';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update prettier.rc for JS projects
        if (!ts && prettier) {
            filesystem.write(`${folder}/.prettierrc.js`, PRETTIER_CONFIG.rc);
        }

        // Configure Jest
        if (!expo) {
            packageJSON.jest.transformIgnorePatterns = JEST.TRANSFORM_IGNORE_PATTERNS;
            packageJSON.jest.setupFiles = JEST.SETUP_FILES;
            packageJSON.jest.moduleNameMapper = JEST.MODULE_NAME_MAPPER;
            filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });
        }

        // Link native modules
        if (!expo) {
            const command = `cd ${folder} && ${NPM7_PREFIX} && npx react-native-asset`;
            const output = await system.run(command);
            print.info(output);
        }

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
                'Due to some issues with the latest version of Xcode, we have disabled Flipper in the iOS project (refer to https://github.com/facebook/react-native/issues/31179).'
            );
        print.info('');
    };

    toolbox.addBLUI = {
        angular: addBLUIAngular,
        react: addBLUIReact,
        reactNative: addBLUIReactNative,
    };
};
