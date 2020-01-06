import { Framework, Dependency, PackageJSON, Script } from '../types';
import { SUPPORTED_BROWSERS } from '../constants';

export const newProjectCommand = (framework: Framework, name: string, directory: string = './', ci: boolean = true, js: boolean = false) => {
    let command;
    switch (framework.toLowerCase()) {
        case 'angular':
            command = `npx -p @angular/cli ng new ${name} --directory "${directory}/${name}" --style=scss`;
            if(ci) command += ' --skipInstall --skipGit --routing=false --inlineStyle --inlineTemplate';
            break;
        case 'react':
            command = `cd ${directory} && npx create-react-app ${name} ${!js ? '--template typescript' : ''}`;
            break;
        case 'ionic':
            command = `cd ${directory} && npx ionic start ${name} blank`;
            if(ci) command += ' --no-deps --no-git';
            break;
        case 'reactnative':
            command = `npx -p expo-cli expo init --name=${name} --template=blank "${directory}/${name}"`;
            break;
        default:
            return '';
    }
    return command;
}

export const updatePackageDependencies = (packageFile: PackageJSON, dependencies: Array<Dependency> = [], devDependencies: Array<Dependency> = []) => {
    let newDependencies = packageFile.dependencies || {};
    for(let i = 0; i < dependencies.length; i++){
        newDependencies[dependencies[i].name] = dependencies[i].version;
    }
    packageFile.dependencies = newDependencies;

    let newDevDependencies = packageFile.devDependencies || {};
    for(let i = 0; i < devDependencies.length; i++){
        newDevDependencies[devDependencies[i].name] = devDependencies[i].version;
    }
    packageFile.devDependencies = newDevDependencies;
    
    return packageFile;
}

export const updateScripts = (packageFile: PackageJSON, scripts: Array<Script> = []) => {
    let newScripts = packageFile.scripts || {};
    for(let i = 0; i < scripts.length; i++){
        newScripts[scripts[i].name] = scripts[i].command;
    }
    packageFile.scripts = newScripts;
    return packageFile;
}

export const updateBrowsersListFile = (browsersFile: string) => {
    return browsersFile.replace(/^[^# \t\n\r].+$/gim, '').replace(/^$[\r\n]+/gim, '') + SUPPORTED_BROWSERS.asString;
}
export const updateBrowsersListJson = (browsersJSON) => {
    browsersJSON.browserslist.production = SUPPORTED_BROWSERS.asObject.production;
    browsersJSON.browserslist.development = SUPPORTED_BROWSERS.asObject.development;
    return browsersJSON;
}