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

    const addLintConfig = (props: LintConfigProps): void => {
        const { folder, config } = props;
        const spinner = print.spin('Configuring PX Blue code standards...');

        filesystem.write(`${folder}/.eslintrc.js`, config, { jsonIndent: 4 });
        const timer = system.startTimer();

        spinner.stop();
        print.success(`PX Blue code standards applied successfully in ${timer() / 1000} seconds`);
    };

    toolbox.fileModify = {
        installDependencies: installDependencies,
        addLintConfig: addLintConfig,
    };
};
