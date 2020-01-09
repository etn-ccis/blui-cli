# PX Blue CLI
This Command Line Interface is a utility for analyzing and updating PX Blue repositories on GitHub. It can also be used to start new PX Blue projects with automatic theme integration.

## Installation
To install the CLI:
```shell
$ yarn global add @pxblue/cli
```
> NOTE: this is not published here yet. It's currently published as **pxb-cli**

To develop with a local copy of the CLI:
```shell
$ git clone https://github.com/pxblue/pxblue-cli
$ cd cli
$ yarn
$ yarn link
```
Your changes to the source code will be available in the terminal commands.

Check out the [Gluegun documentation](https://github.com/infinitered/gluegun/tree/master/docs) for information on modifying the CLI.

## Available Commands
|command [&lt;arguments&gt;] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| option flags &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| description |
|-----------------------|------------|-------------|
| `pxb version` |  | displays the version of the currently installed CLI |
| `pxb help` |  | lists all available commands and descriptions |
| `pxb clone <repo> <branch>` |  | Clones the specified branch from the specified repository to a local folder ("all" to get all branches) |
| `pxb new project` | `--javascript` `--typescript` | Creates a new skeleton project with PX Blue integration. You will be prompted to select a framework and a project name. React/React Native projects will prompt you for a language (TS or JS) unless `--javascript` or `--typescript` is specified on the command line. |
| `pxb new repository` | `--empty` | Creates a new example repository on github. If `--empty` is specified, the repository will be empty. Otherwise, branches will be created for each supported framework and populated with a skeleton application with PX Blue integration. |
| `pxb update branches <repo>` |  | Creates any missing framework branches on the specified repository. |
| `pxb update labels <repo>` |  | Updates the issue labels on the specified repository. |
| `pxb update meta <repo> <description>` |  | Updates the metadata on the specified repository based on the files in the example template (readme, circleci, gitignore, editorconfig, etc.). |
| `pxb update protection <repo> <branch>` | `--disabled` | Sets branch protection for the specified repository and branch. If branch is 'all', all framework branches will be updated. If `--disabled` is set, protections will be turned off instead of on. |
| `pxb update security <repo>` |  | Enables vulnerability alerts, and disabled automated vulnerability fixes for the specified repository. |
| `pxb status <repo>` | `--all`<br/> `--detailed` | checks the specified repository for required branches, issue labels, and vulnerability checks. Prints the results of the check. If no repository is specified, you will be prompted for one. Using `--all` will list results for all public repositories. Using `--detailed` will present itemized results in a table rather than a simple pass/fail.|

> **NOTE:** For the github related commands to work, you will be need to authenticate using a Personal Access Token for an account that has the permissions to perform the desired actions. To skip the prompt, you may store this value in a `GITHUB_ACCESS_TOKEN` environment variable.

## Publishing to NPM
To publish the PX Blue CLI:
```shell
$ yarn lint
$ yarn test
$ yarn build
$ npm publish
```
> **NOTE**: you must be logged in to your npm account in the terminal for the publish command to work.

