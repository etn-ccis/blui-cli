import { Framework, Dependency, PackageJSON } from '../types';
import { SUPPORTED_BROWSERS } from '../constants';

export const newProjectCommand = (framework: Framework, name: string, directory: string = './', ci: boolean = true) => {
    let command;
    switch (framework.toLowerCase()) {
        case 'angular':
            command = `ng new ${name} --directory "${directory}/${name}" --style=scss`;
            if(ci) command += ' --skipInstall --skipGit --routing=false --inlineStyle --inlineTemplate';
            break;
        case 'react':
            command = `cd ${directory} && create-react-app ${name}`;
            break;
        case 'ionic':
            command = `cd ${directory} && ionic start ${name} blank`;
            if(ci) command += ' --no-deps --no-git';
            break;
        case 'reactnative':
            command = `expo init --name=${name} --template=blank "${directory}/${name}"`;
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

export const updateBrowsersListFile = (browsersFile: string) => {
    return browsersFile.replace(/^[^# \t\n\r].+$/gim, '').replace(/^$[\r\n]+/gim, '') + SUPPORTED_BROWSERS.asString;
}
export const updateBrowsersListJson = (browsersJSON) => {
    browsersJSON.browserslist.production = SUPPORTED_BROWSERS.asObject.production;
    browsersJSON.browserslist.development = SUPPORTED_BROWSERS.asObject.development;
    return browsersJSON;
}