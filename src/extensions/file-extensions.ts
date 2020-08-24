/*
 * This file includes utilities for modifying files, such as installing new dependencies
 * and creating config files.
 */
import { GluegunToolbox, filesystem } from 'gluegun';

type InstallProps = {
    folder: string;
    dependencies: string[];
    dev?: boolean;
    description: string;
};
type LintConfigProps = {
    folder: string;
    config: string;
};

module.exports = (toolbox: GluegunToolbox): void => {
    const { system, print } = toolbox;

    const installDependencies = async (props: InstallProps): Promise<void> => {
        const { folder, dependencies, dev = false, description } = props;
        if (dependencies.length < 1) return;

        const isYarn = filesystem.exists(`./${folder}/yarn.lock`);
        const installCommand = dev
            ? `cd ${folder} && ${isYarn ? 'yarn add --dev' : 'npm install --save-dev'}`
            : `cd ${folder} && ${isYarn ? 'yarn add' : 'npm install --save'}`;

        // Install Dependencies
        const spinner = print.spin(`Installing ${description}...`);
        const command = `${installCommand} ${dependencies.join(' ')}`;

        const timer = system.startTimer();
        const output = await system.run(command);
        spinner.stop();
        print.info(output);
        print.success(`${description} installed successfully in ${timer() / 1000} seconds`);
    };

    const addLintConfig = async (props: LintConfigProps): Promise<void> => {
        const { folder, config } = props;
        const projectName = folder.slice(2);
        const spinner = print.spin('Configuring PX Blue code standards...');

        const pathInFolder = (filename: string): string => filesystem.path(folder, filename);

        filesystem.write(pathInFolder('.eslintrc.js'), config, { jsonIndent: 4 });

        // This is an Angular-only problem.
        // We don't want an extra tslint.json when pxblue lint config is present.
        if (filesystem.exists(pathInFolder('tslint.json'))) {
            // remove tslint.json
            filesystem.remove(pathInFolder('tslint.json'));

            // uninstall tslint
            let output = '';
            if (filesystem.exists(pathInFolder('yarn.lock'))) {
                output = await system.run(`cd ${folder} && yarn remove tslint`);
            } else {
                output = await system.run(`cd ${folder} && npm uninstall tslint`);
            }
            print.info(output);

            // remove lint attribute in angular.json
            if (filesystem.exists(pathInFolder('angular.json'))) {
                const angularJSON = filesystem.read(pathInFolder('angular.json'), 'json');
                angularJSON.projects[projectName].architect.lint = undefined;
                filesystem.write(pathInFolder('angular.json'), JSON.stringify(angularJSON, null, 4));
            }
        }

        spinner.stop();
    };

    toolbox.fileModify = {
        installDependencies: installDependencies,
        addLintConfig: addLintConfig,
    };
};
