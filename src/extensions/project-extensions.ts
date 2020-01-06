import { GluegunToolbox } from 'gluegun';
import { PXBLUE_DEPENDENCIES, PXBLUE_DEV_DEPENDENCIES, STYLES, PXBLUE_IMPORTS, ROOT_COMPONENT, PXBLUE_SCRIPTS_TS, LINT_CONFIG, PXBLUE_DEV_DEPENDENCIES_TS } from '../constants';
import { Framework } from '../types';

import { newProjectCommand, updatePackageDependencies, updateBrowsersListFile, updateBrowsersListJson, updateScripts } from '../utilities/utilities';

module.exports = (toolbox: GluegunToolbox) => {
    const { filesystem } = toolbox;

    const createProject = async (framework: Framework, name: string, directory: string = './', withBlue: boolean = true, ci: boolean = true, js: boolean = false): Promise<void> => {
        await toolbox.system.run(newProjectCommand(framework, name, directory, ci, js), { trim: true });
        await toolbox.system.run(`cd ${directory}/${name} && rm -rf package-lock.json && rm -rf yarn.lock`, { trim: true });
        if (withBlue) {
            if(framework === 'angular') await addPXBlueAngular(name, directory);
            else if(framework === 'react') await addPXBlueReact(name, directory, js);
            else if(framework === 'ionic') await addPXBlueIonic(name, directory);
            else if(framework === 'reactnative') await addPXBlueReactNative(name, directory);
        }
        if (!ci) await toolbox.system.run(`cd ${directory}/${name} && yarn`, { trim: true });
    }


    const addPXBlueAngular = async (name: string, directory: string = './'): Promise<void> => {
        const folder = `./${directory}/${name}`;
        
        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON.author = "PX Blue <pxblue@eaton.com>";
        packageJSON.scripts.start = "ng serve --configuration es5";
        packageJSON = updatePackageDependencies(packageJSON, PXBLUE_DEPENDENCIES.angular, PXBLUE_DEV_DEPENDENCIES.angular);
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 2 });

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
            "./node_modules/@pxblue/themes/angular/theme.scss",
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
    }

    const addPXBlueReact = async (name: string, directory: string = './', js: boolean = false): Promise<void> => {
        const folder = `./${directory}/${name}`;

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON.author = "PX Blue <pxblue@eaton.com>";
        packageJSON = updatePackageDependencies(packageJSON, PXBLUE_DEPENDENCIES.react, PXBLUE_DEV_DEPENDENCIES.react);
        
        // Update Browsers List for IE 11
        packageJSON = updateBrowsersListJson(packageJSON);

        // Add linting and prettier for TS files
        if(!js){
            filesystem.write(`${folder}/.eslintrc.js`, LINT_CONFIG, {jsonIndent: 4});
            packageJSON = updatePackageDependencies(packageJSON, [], PXBLUE_DEV_DEPENDENCIES_TS.react);
            packageJSON = updateScripts(packageJSON, PXBLUE_SCRIPTS_TS.react);
            packageJSON.prettier = "@pxblue/prettier-config";
        }

        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 4 });

        // Update index.css
        filesystem.remove(`${folder}/src/index.css`);
        filesystem.write(`${folder}/src/index.css`, STYLES);

        // Update index.js
        let index = filesystem.read(`${folder}/src/index.${js ? 'js' : 'tsx'}`, 'utf8');
        let imports = PXBLUE_IMPORTS.react.join('\r\n');
        index = (`import 'react-app-polyfill/ie11';\r\nimport 'react-app-polyfill/stable';\r\n` + index)
            .replace('\'./serviceWorker\';', '\'./serviceWorker\';\r\n' + imports + '\r\n')
            .replace('<App />', ROOT_COMPONENT.react);
        filesystem.write(`${folder}/src/index.${js ? 'js' : 'tsx'}`, index);

        // Update index.html
        let html = filesystem.read(`${folder}/public/index.html`, 'utf8');
        html = html.replace(/<title>.*<\/title>/ig, `<title>${name}</title>`);
        filesystem.write(`${folder}/public/index.html`, html);

        
    }

    const addPXBlueIonic = async (name: string, directory: string): Promise<void> => {
        const folder = `./${directory}/${name}`;

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON.author = "PX Blue <pxblue@eaton.com>";
        packageJSON = updatePackageDependencies(packageJSON, PXBLUE_DEPENDENCIES.ionic, PXBLUE_DEV_DEPENDENCIES.ionic);
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 2 });

        // Update index.html
        let html = filesystem.read(`${folder}/src/index.html`, 'utf8');
        html = html.replace(/<title>.+<\/title>/ig, `<title>${name}</title>`)
            .replace(/<app-root>.*<\/app-root>/ig, ROOT_COMPONENT.ionic);
        filesystem.write(`${folder}/src/index.html`, html);

        // Update angular.json
        let angularJSON: any = filesystem.read(`${folder}/angular.json`, 'json');
        const styles = [
            { "input": "src/theme/variables.scss" },
            { "input": "src/global.scss" },
            { "input": "./node_modules/@pxblue/themes/angular/theme.scss" },
            { "input": "./node_modules/typeface-open-sans" }
        ];
        angularJSON.projects.app.architect.build.options.styles = styles;
        filesystem.write(`${folder}/angular.json`, angularJSON, { jsonIndent: 2 });
    }

    const addPXBlueReactNative = async (name: string, directory: string): Promise<void> => {
        const folder = `./${directory}/${name}`;

        // Update package.json
        let packageJSON: any = filesystem.read(`${folder}/package.json`, 'json');
        packageJSON.author = "PX Blue <pxblue@eaton.com>";
        packageJSON = updatePackageDependencies(packageJSON, PXBLUE_DEPENDENCIES.reactnative, PXBLUE_DEV_DEPENDENCIES.reactnative);
        packageJSON.scripts.test = 'jest';
        filesystem.write(`${folder}/package.json`, packageJSON, { jsonIndent: 2 });
    }

    // Attach github tools to the toolbox
    toolbox.projects = {
        create: createProject
    };
}