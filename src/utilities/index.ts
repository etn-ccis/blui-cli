import { SUPPORTED_BROWSERS } from '../constants';
import { PackageJSON, Script, Language } from './types';
export * from './types';

export const updateScripts = (packageFile: PackageJSON, scripts: Script[] = []): PackageJSON => {
    const newScripts = packageFile.scripts || {};
    for (let i = 0; i < scripts.length; i++) {
        newScripts[scripts[i].name] = scripts[i].command;
    }
    packageFile.scripts = newScripts;
    return packageFile;
};

export const updateBrowsersListFile = (browsersFile: string): string =>
    browsersFile.replace(/^[^# \t\n\r].+$/gim, '').replace(/^$[\r\n]+/gim, '') + SUPPORTED_BROWSERS.string;
export const updateBrowsersListJson = (browsersJSON: any): any => {
    browsersJSON.browserslist.production = SUPPORTED_BROWSERS.object.production;
    browsersJSON.browserslist.development = SUPPORTED_BROWSERS.object.development;
    return browsersJSON;
};

// convert the string to lower case, and remove all the spaces and dashes.
export const stringToLowerCaseNoSpace = (str: string): string => str.toLowerCase().replace(/[- ]/gi, '');

export const assignJsTs = (str: string): Language => {
    switch (stringToLowerCaseNoSpace(str)) {
        case 'ts':
        case 'typescript':
            return 'ts';
        case 'js':
        case 'javascript':
        default:
            return 'js';
    }
};
