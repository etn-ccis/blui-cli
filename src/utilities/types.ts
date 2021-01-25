export type Language = 'ts' | 'js';
export type Cli = 'expo' | 'rnc';

export type Template = 'Blank' | 'Basic Routing' | 'Authentication';

export type AngularProps = {
    name: string;
    lint: boolean;
    prettier: boolean;
    template: string;
};
export type IonicProps = {
    name: string;
    lint: boolean;
    prettier: boolean;
};
export type ReactProps = {
    name: string;
    language: Language;
    lint: boolean;
    prettier: boolean;
};
export type ReactNativeProps = {
    name: string;
    language: Language;
    lint: boolean;
    prettier: boolean;
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
    // will also be used as the flag name for the options
    optionName: string;
    // question to ask the user if no legit answer provided via flagged options
    question: string;
    // type of questions, controls if it is a :
    // Yes/No question ('confirm'); or
    // multiple choice question ('radio', etc); or
    // text input ('input')
    type?: string;
    // choices given to the user if it is a multiple choice question
    choices?: string[];
    // default value if it is a Yes/No question
    initial?: boolean;
};
