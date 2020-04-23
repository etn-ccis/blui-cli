export type Language = 'ts' | 'js';
export type Cli = 'expo' | 'rnc';

export type AngularProps = {
    name: string;
    lint: boolean;
};
export type ReactProps = {
    name: string;
    language: Language;
    lint: boolean;
};
export type ReactNativeProps = {
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

export type Question = {
    name: string;
    question: string;
    type?: string;
    choices?: string[];
    initial?: boolean;
};
