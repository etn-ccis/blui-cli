import { SUPPORTED_BROWSERS } from '../constants';

export type PackageJSON = {
    dependencies: object
    devDependencies?: object
    browserslist?: object
    scripts?: object
}
export type Script = {
    name: string
    command: string
  }

export const updateScripts = (packageFile: PackageJSON, scripts: Script[] = []) => {
    let newScripts = packageFile.scripts || {};
    for (let i = 0; i < scripts.length; i++) {
        newScripts[scripts[i].name] = scripts[i].command;
    }
    packageFile.scripts = newScripts;
    return packageFile;
}

export const updateBrowsersListFile = (browsersFile: string) => {
    return browsersFile.replace(/^[^# \t\n\r].+$/gim, '').replace(/^$[\r\n]+/gim, '') + SUPPORTED_BROWSERS.string;
}
export const updateBrowsersListJson = (browsersJSON) => {
    browsersJSON.browserslist.production = SUPPORTED_BROWSERS.object.production;
    browsersJSON.browserslist.development = SUPPORTED_BROWSERS.object.development;
    return browsersJSON;
}