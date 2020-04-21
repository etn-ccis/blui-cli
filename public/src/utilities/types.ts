export type Language = 'ts' | 'js';
export type Cli = 'expo' | 'rnc';

export type AddAngularProps = {
    name: string;
    lint: boolean;
};
export type AddReactProps = {
    name: string;
    language: Language;
    lint: boolean;
};
export type AddReactNativeProps = {
    name: string;
    language: Language;
    lint: boolean;
    cli: Cli;
};

export type PackageJSON = {
    dependencies: object;
    devDependencies?: object;
    browserslist?: object;
    scripts?: object;
};
export type Script = {
    name: string;
    command: string;
};
