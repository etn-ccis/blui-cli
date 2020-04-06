import { GluegunToolbox, filesystem } from 'gluegun';
import * as ora from 'ora';
import { GluegunTimer } from 'gluegun/build/types/toolbox/system-types';
import { 
    DEPENDENCIES, 
    DEV_DEPENDENCIES, 
    LINT_DEPENDENCIES, 
    LINT_SCRIPTS, 
    LINT_CONFIG, 
    SCRIPTS,
    ROOT_COMPONENT,
    STYLES
} from '../constants';
import { updateScripts, updateBrowsersListFile } from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    const {
        system,
        parse,
        print,
    } = toolbox;

    /* 
        Create Basic CLI skeleton projects
    */
    const createAngularProject = async (): Promise<void> => {
        const [name, lint] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Use PX Blue Lint & Prettier configs?', required: true, type: 'radio', choices: ['Yes', 'No'] }
        ]);

        const command = `npx -p @angular/cli ng new ${name} --directory "${name}" --style=scss`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created Angular project (${name}) in ${timer() / 1000} seconds`);

        await addPXBlueAngular(name, lint === 'Yes');
    }

    const createReactProject = async (): Promise<void> => {
        const [name, language] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] }
        ]);

        const command = `npx create-react-app ${name} ${language === 'TypeScript' ? '--template typescript' : ''}`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created React project (${name}) in ${timer() / 1000} seconds`);
    }

    const createIonicProject = async (): Promise<void> => {
        const [name] = await parse([
            { question: 'Project Name', required: true }
        ]);

        const command = `npx ionic start ${name} blank`;

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created Ionic project (${name}) in ${timer() / 1000} seconds`);
    }

    const createReactNativeProject = async (): Promise<void> => {
        const [name, language, cli] = await parse([
            { question: 'Project Name', required: true },
            { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] },
            { question: 'CLI', required: true, type: 'radio', choices: ['React Native Community (recommended)', 'Expo'] },
        ]);

        let command: string;
        if (cli === 'Expo') {
            command = `npx -p expo-cli expo init --name=${name} --template=${language === 'TypeScript' ? 'expo-template-blank-typescript' : 'blank'} "${name}"`;
        }
        else {
            command = `npx react-native init ${name} ${language === 'TypeScript' ? '--template react-native-template-typescript' : ''}`
        }

        const spinner = print.spin('Creating new project (this may take a few minutes)...');
        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();

        print.info(output);
        print.success(`Created React Native project (${name}) in ${timer() / 1000} seconds`);
    }



    /*
        Add PX Blue integrations to skeleton projects
    */
    const addPXBlueAngular = async (name: string, lint: boolean): Promise<void> => {
        const folder = `./${name}`;
        const isYarn = await filesystem.exists(`./${name}/yarn.lock`);
        let spinner: ora.Ora;
        let command: string;
        let output: string;
        let timer: GluegunTimer;

        const installCommand = `cd ${folder} && ${isYarn ? 'yarn add' : 'npm install --save'}`;
        const devInstallCommand = `cd ${folder} && ${isYarn ? 'yarn add --dev' : 'npm install --save-dev'}`

        // Install Dependencies
        spinner = print.spin('Installing PX Blue dependencies...');
        const dependencies = DEPENDENCIES.angular;
        command = `${installCommand} ${dependencies.join(' ')}`;

        timer = system.startTimer();
        output = await system.run(command);
        spinner.stop();
        print.info(output);
        print.success(`PX Blue dependencies installed successfully in ${timer() / 1000} seconds`);

        // Install DevDependencies
        if(DEV_DEPENDENCIES.angular.length){
            spinner = print.spin('Installing PX Blue devDependencies...');
            const dependencies = DEV_DEPENDENCIES.angular;
            command = `${devInstallCommand} ${dependencies.join(' ')}`;
    
            timer = system.startTimer();
            output = await system.run(command);
            spinner.stop();
            print.info(output);
            print.success(`PX Blue devDependencies installed successfully in ${timer() / 1000} seconds`);
        }

        // Install Code Standard Packages (optional)
        if (lint) {
            spinner = print.spin('Installing PX Blue code standard packages...');            
            command = isYarn ? `cd ${folder} && yarn add --dev ${LINT_DEPENDENCIES.angular.join(' ')}` : `cd ${folder} && npm install --save-dev ${LINT_DEPENDENCIES.angular.join(' ')}`;

            timer = system.startTimer();
            output = await system.run(command);
            spinner.stop();
            print.info(output);

            // Add the configurations
            spinner = print.spin('Configuring PX Blue code standards...');
            
            filesystem.write(`${folder}/.eslintrc.js`, LINT_CONFIG.ts, { jsonIndent: 4 });
            timer = system.startTimer();
            output = await system.run(command);
            
            spinner.stop();
            print.info(output);
            print.success(`PX Blue code standards applied successfully in ${timer() / 1000} seconds`);
        }

        // Update package.json
        spinner = print.spin('Updating package.json...');  

        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON = updateScripts(packageJSON, SCRIPTS.angular.concat(lint ? LINT_SCRIPTS.angular : []))
        if(lint) packageJSON.prettier = "@pxblue/prettier-config";
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        spinner.stop();
        print.success(`Package.json updated`);


        spinner = print.spin('Performing some final cleanup...'); 
        // Update browsers list
        let browsers = filesystem.read(`${folder}/browserslist`, 'utf8');
        browsers = updateBrowsersListFile(browsers);
        filesystem.write(`${folder}/browserslist`, browsers);

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html.replace(/<title>.+<\/title>/ig, `<title>${name}</title>`)
            .replace(/<app-root>.*<\/app-root>/ig, ROOT_COMPONENT.angular);
        filesystem.write(`${folder}/src/index.html`, html);

        // Update angular.json
        let angularJSON: any = filesystem.read(`${folder}/angular.json`, 'json');
        const styles = [
            "src/styles.scss",
            "./node_modules/@pxblue/angular-themes/theme.scss",
            "./node_modules/typeface-open-sans"
        ];
        angularJSON.projects[name].architect.build.options.styles = styles;
        angularJSON.projects[name].architect.test.options.styles = styles;

        // make it work for ie11
        angularJSON.projects[name].architect.build.configurations['es5'] = { tsConfig: "./tsconfig.es5.json" };
        angularJSON.projects[name].architect.serve.configurations['es5'] = { browserTarget: `${name}:build:es5` };
        filesystem.write(`${folder}/tsconfig.es5.json`, `{\r\n\t"extends": "./tsconfig.json",\r\n\t"compilerOptions": {\r\n\t\t"target": "es5"\r\n\t}\r\n}`);

        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 2 });

        // Update styles.scss
        filesystem.remove(`${folder}/src/styles.scss`);
        filesystem.write(`${folder}/src/styles.scss`, STYLES);

        spinner.stop();
        print.success(`PX Blue integration completed successfully. Your project is ready to run!`);
    }

    toolbox.createProject = {
        angular: createAngularProject,
        react: createReactProject,
        ionic: createIonicProject,
        reactNative: createReactNativeProject,
    };
};
