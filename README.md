# Brightlayer UI CLI

This Command Line Interface is a utility for creating new Brightlayer UI applications with automatic integration of themes, components, etc.

## Prerequisites

In order to use this utility you must have the following installed:

-   [NodeJS](https://nodejs.org/en/download/) 12+
-   npm or yarn
-   Git

Additional requirements for creating React Native projects:

-   [Cocoapods](https://cocoapods.org/) 1.8+ (for ios)

## Usage

The Brightlayer UI CLI can be utilized via npx without having to install any global packages (recommended):

```
npx -p @brightlayer-ui/cli blui <command>
```

If you would prefer to have a global install of the CLI you may do so via:

```shell
$ yarn global add @brightlayer-ui/cli
```

or

```shell
$ npm install -g @brightlayer-ui/cli
```

> **NOTE:** If you are using NPM version 7+, you will need to update your global npm configuration to use legacy peer dependencies for installing packages by adding `legacy-peer-deps=true` to your global `.npmrc` file.

### Available Commands

| command                | description                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blui help`            | lists all available commands and descriptions                                                                                                                                   |
| `blui version`         | displays the version of the currently installed CLI                                                                                                                             |
| `blui new <framework>` | Creates a new skeleton project with Brightlayer UI integration. You'll be prompted to give your project a name and select various options depending on your selected framework. |

#### Available options

The following table list out some options for the `blui new` command. All these options can be configured

| Option                                                   | Description                                                                                                                                                                     |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <code>--framework=<angular\|react\|react-native></code>  | The framework in which the project will be generated.                                                                                                                           |
| `--name=<name>`                                          | Project name                                                                                                                                                                    |
| <code>--template=<blank\|routing\|authentication></code> | Template to use to start the project                                                                                                                                            |
| `--lint`                                                 | (TypeScript projects only) Install and configure [Brightlayer UI lint package](https://www.npmjs.com/package/@brightlayer-ui/eslint-config) (omit or `--lint=false` to disable) |
| `--prettier`                                             | Install and configure [Brightlayer UI prettier package](https://www.npmjs.com/package/@brightlayer-ui/prettier-config) (omit or `--prettier=false` to disable)                  |
| <code>--language=<typescript></code>                     | (React & React Native Only) The language in which the project will be generated                                                                                                 |

## Detailed Usage

To start a new project with Brightlayer UI integration follow the steps below. We recommend using `npx` (instead of installing it globally) to run the CLI as it will ensure you are always using the most up-to-date version.

1. `npx -p @brightlayer-ui/cli blui new`
2. Choose your desired framework from the list
    - Alternatively, you can pre-select a framework by running `npx -p @brightlayer-ui/cli blui new <framework>`
3. You will be prompted to enter a name for your project. Make sure the name you select meets the requirements of the CLI for your chosen framework.
4. You will be prompted to choose a template from our list of [angular](https://github.com/brightlayer-ui/angular-cli-templates/tree/master), [react](https://github.com/brightlayer-ui/react-cli-templates/tree/master), or [react native](https://github.com/brightlayer-ui/react-native-cli-templates/tree/master) templates to scaffold your project:
    - Blank: a basic application with a simple placeholder homepage
    - Routing: integrates React Router with a simple drawer navigation and several placeholder routes
    - Authentication: integrates the [react](https://www.npmjs.com/package/@brightlayer-ui/react-auth-workflow), [angular](https://www.npmjs.com/package/@brightlayer-ui/angular-auth-workflow), or [react native](https://www.npmjs.com/package/@brightlayer-ui/react-native-auth-workflow) auth-workflow login and registration screens plus everything from the routing template
5. If you are creating a React or React Native project, you will be prompted to choose JavaScript or Typescript for your project language.
6. You will be asked if you want to use the Brightlayer UI Linting configuration and code formatting packages (recommended).
7. The CLI will install all of the necessary dependencies for your project and integrate the Brightlayer UI components, themes, and fonts. When complete, the CLI should present you instructions for running your project.
    > **Note for React Native projects:** There are additional steps you must run for your project to run on iOS. Follow the on-screen instructions for running `pod install` to link the react-native-vector-icons package. If you are using xCode 11+, you will also need to update the Build Phases in xCode to avoid duplicated resources errors (refer to [this issue](https://github.com/oblador/react-native-vector-icons/issues/1074)).

### Testing / Debugging Templates (For Maintainers)

You should always use the latest version of the templates when starting a new project to make sure you have the latest features and bug fixes.

#### Testing CLI itself

Once changes are made, you need to build the binary file first, and link it.

```
yarn build
yarn link
```

Now you may use it as if it is installed locally, such as running `blui new` from another directory.

#### Testing Templates

If you are a library maintainer and you need to test out different versions of the templates during development, there are several ways to do this:

1.  Use `--alpha` or `--beta` flags on the command line. This will install the latest alpha or beta version of the template package from NPM, respectively.
2.  Use `--template=<blank|routing|authentication>@x.x.x` to specify a specific version of the template package to install from NPM.
3.  Use a local template file via `--template=file:./path/to/folder`. When using this syntax, the directory that you point to should contain all of the necessary files for a template. This is usually the "template name" folder (e.g., `./myTemplates/authentication`, not `./myTemplates/authentication/template`).
    -   If you are working in a local copy of a Brightlayer UI CLI templates repository, assuming that folder is in your current working directory, the paths would be:
        -   `--template=file:./angular-cli-templates/src/app/<name>`
        -   `--template=file:./react-cli-templates/<name>`
        -   `--template=file:./react-native-cli-templates/<name>`
