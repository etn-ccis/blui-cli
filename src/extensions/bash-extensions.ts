import { GluegunToolbox } from 'gluegun';
import { EXAMPLE_BRANCHES, TEMP_FOLDER, TEMPLATES_FOLDER } from '../constants';
import { Framework, BuildExampleProps, UpdateExampleProps, Branch, MetaFiles } from '../types';

module.exports = (toolbox: GluegunToolbox) => {
    const { strings, print } = toolbox;

    const prepareTemplateFilesCommand = (repository: string, description: string): string => {
        return `
            git clone https://github.com/pxblue/example_template ${TEMPLATES_FOLDER}
            sed -i "" "s/\\\[repository-name\\\]/${repository}/g" ./${TEMPLATES_FOLDER}/README.md
            sed -i "" "s/\\\[PROJECT NAME\\\]/${strings.startCase(repository)}/g" ./${TEMPLATES_FOLDER}/README.md
            sed -i "" "s/\.\.\.\\\[DESCRIPTION\\\]/ ${description}/g" ./${TEMPLATES_FOLDER}/README.md
            sed -i "" "s/\\\[REPOSITORY\-NAME\\\]/${repository}/g" ./${TEMPLATES_FOLDER}/.circleci/config.yml
        `;
    }

    const copyTemplateFilesCommand = (src: string, dest: string, framework: Framework, files: MetaFiles): string => {
        const branch = EXAMPLE_BRANCHES.filter((b) => b.name === framework)[0];
        return `
            
            ${files.readme ? `cp -r ./${src}/README.md ./${dest}/README.md` : ''}
            ${files.license ? `cp -r ./${src}/LICENSE ./${dest}/LICENSE` : ''}
            ${files.ignore ? `cp -r ./${src}/.gitignore ./${dest}/.gitignore` : ''}
            ${files.editor ? `cp -r ./${src}/.editorconfig ./${dest}/.editorconfig` : ''}
            ${files.circle ? `
                mkdir ./${dest}/.circleci
                cp -r ./${src}/.circleci/config.yml ./${dest}/.circleci/config.yml
                sed -i "" "s/\\\[NODE-VERSION\\\]/${branch.node}/g" ./${dest}/.circleci/config.yml
                sed -i "" "s/\\\[TEST-COMMAND\\\]/${branch.test}/g" ./${dest}/.circleci/config.yml
                sed -i "" "s/\\\[BUILD-COMMAND\\\]/${branch.build}/g" ./${dest}/.circleci/config.yml
            ` : ''}
        `;
    }

    const copySplashFilesCommand = (src: string, dest: string, framework: Framework): string => {
        const subfolder = (framework === 'ionic') ? 'resources' : 'assets';
        return `
            ${framework === 'ionic' ? `mkdir ${dest}/${subfolder}` : ''}
            cp -r ./${src}/assets/${framework}/icon.png ./${dest}/${subfolder}/icon.png
            cp -r ./${src}/assets/${framework}/splash.png ./${dest}/${subfolder}/splash.png
            ${framework === 'ionic' ? `cd ${dest} && ionic cordova resources` : ''}
            ${framework === 'reactnative' ? `cd ${dest} && expo optimize` : ''}
        `;
    }

    const createBranchesCommand = (repository: string, folder: string, framework: string, update: boolean = false): string => {
        const branch = EXAMPLE_BRANCHES.filter((b) => b.name === framework)[0];
        const branchName = branch ? branch.name : framework;
        let str = `
            cd ${TEMP_FOLDER}/${folder}
        `;
        if (!update) {
            str += `
                git init
                git checkout -b ${branchName}
                git remote add origin https://github.com/pxblue/${repository}.git
            `;
        }
        str += `
            git add -A
            git commit -m "Create ${strings.startCase(branchName)} Branch"
            git push -u origin ${branchName}
        `;
        return str;
    }

    const cloneLocalFrameworkFolders = async (repository: string, branches: Array<Branch>) => {
        branches = branches || EXAMPLE_BRANCHES;
        let spinner;
        try {
            spinner = toolbox.print.spin('Creating Project Folder');
            await toolbox.system.run(`mkdir ${toolbox.strings.kebabCase(repository)}`, { trim: true });
            spinner.succeed('Project Folder Created');

            // Create a project for each framework
            for (let i = 0; i < branches.length; i++) {
                const branch = branches[i];
                const folder = `pxblue-${repository}-${branch.name}`;

                // create project and add PX Blue dependencies
                spinner = toolbox.print.spin(`Cloning ${branch.name} Branch`);
                await toolbox.system.run(`cd ${toolbox.strings.kebabCase(repository)} && git clone https://github.com/pxblue/${repository} -b ${branch.name} ${folder}`)
                spinner.succeed(`${branch.name} Project Cloned`);
            }
        }
        catch (err) {
            if (spinner) spinner.fail(`Something went wrong (${err.code})`);
            else {
                print.error(`Something went wrong (${err.code})`);
            }
            print.error(err.message);
            process.exit(1);
        }
    }

    const buildExampleRepository = async (props: BuildExampleProps): Promise<void> => {
        let { repository, description, push, clean, update, branches } = props;
        branches = branches || EXAMPLE_BRANCHES;

        let spinner;
        try {
            spinner = toolbox.print.spin('Creating Temp Folder');
            await toolbox.system.run(`mkdir ${TEMP_FOLDER}`, { trim: true });
            spinner.succeed('Temp Folder Created');

            spinner = toolbox.print.spin('Preparing Template Files');
            await toolbox.system.run(`cd ${TEMP_FOLDER} && ${prepareTemplateFilesCommand(repository, description)}`, { trim: true });
            spinner.succeed('Templates Prepared');

            // Create a project for each framework
            for (let i = 0; i < branches.length; i++) {
                const branch = branches[i];
                const folder = `pxblue-${repository}-${branch.name}`;

                // create project and add PX Blue dependencies
                if (update) {
                    spinner = toolbox.print.spin(`Cloning ${branch.name} Branch`);
                    await toolbox.system.run(`cd ${TEMP_FOLDER} && git clone https://github.com/pxblue/${repository} -b ${branch.name} ${folder}`)
                    spinner.succeed(`${branch.name} Project Cloned`);
                }
                else {
                    spinner = toolbox.print.spin(`Creating ${branch.name} Project`);
                    await toolbox.projects.create(branch.name, folder, `./${TEMP_FOLDER}`, true, true);
                    spinner.succeed(`${branch.name} Project Created`);
                }

                // copy template files
                spinner = toolbox.print.spin('Moving Template Files');
                let files: MetaFiles = { readme: true, license: true, circle: true, editor: true, ignore: true, images: true };
                await toolbox.system.run(`cd ${TEMP_FOLDER} && ${copyTemplateFilesCommand(TEMPLATES_FOLDER, folder, branch.name, files)}`, { trim: true });
                spinner.succeed(`${branch.name} Template Files Moved`);

                // copy the splash images
                if (branch.name === 'reactnative' || branch.name === 'ionic') {
                    spinner = toolbox.print.spin('Moving Splash Assets');
                    await toolbox.system.run(`cd ${TEMP_FOLDER} && ${copySplashFilesCommand(TEMPLATES_FOLDER, folder, branch.name)}`, { trim: true });
                    spinner.succeed(`${branch.name} Splash Images Moved`);
                }

                // push repositories to github
                if (push !== false) {
                    spinner = toolbox.print.spin('Pushing Branch to GitHub');
                    await toolbox.system.run(createBranchesCommand(repository, folder, branch.name, update), { trim: true });
                    spinner.succeed(`${branch.name} Pushed to GitHub`);
                }
            }

            // clean up the temporary directory
            if (clean !== false) {
                spinner = toolbox.print.spin('Cleaning Up Temp Files');
                await toolbox.system.run(`rm -rf ${TEMP_FOLDER}`, { trim: true });
                spinner.succeed('Temporary Files Removed');
            }
        }
        catch (err) {
            if (spinner) spinner.fail(`Something went wrong (${err.code})`);
            else {
                print.error(`Something went wrong (${err.code})`);
            }
            print.error(err.message);
            process.exit(1);
        }
    }

    const updateExampleRepository = async (props: UpdateExampleProps): Promise<void> => {
        let { repository, description, branches, files } = props;
        branches = branches || EXAMPLE_BRANCHES;

        let spinner;
        try {
            const now = Date.now();
            spinner = toolbox.print.spin('Creating Temp Folder');
            await toolbox.system.run(`mkdir ${TEMP_FOLDER}`, { trim: true });
            spinner.succeed('Temp Folder Created');

            spinner = toolbox.print.spin('Preparing Template Files');
            await toolbox.system.run(`cd ${TEMP_FOLDER} && ${prepareTemplateFilesCommand(repository, description)}`, { trim: true });
            spinner.succeed('Templates Prepared');

            // Create a project for each framework
            for (let i = 0; i < branches.length; i++) {
                const branch = branches[i];
                const folder = `pxblue-${repository}-${branch.name}`;

                // clone the project
                spinner = toolbox.print.spin(`Cloning ${branch.name} Branch`);
                await toolbox.system.run(`cd ${TEMP_FOLDER} && git clone https://github.com/pxblue/${repository} -b ${branch.name} ${folder}`)
                spinner.succeed(`${branch.name} Project Cloned`);

                // create a new update branch
                spinner = toolbox.print.spin(`Creating update branch`);
                await toolbox.system.run(`cd ${TEMP_FOLDER}/${folder} && git checkout -b automated-update/${branch.name}-${now}`)
                spinner.succeed(`Update branch created`);

                // copy template files
                spinner = toolbox.print.spin('Moving Template Files');
                await toolbox.system.run(`cd ${TEMP_FOLDER} && ${copyTemplateFilesCommand(TEMPLATES_FOLDER, folder, branch.name, files)}`, { trim: true });
                spinner.succeed(`${branch.name} Template Files Moved`);

                // copy the splash images
                if ((branch.name === 'reactnative' || branch.name === 'ionic') && files.images) {
                    spinner = toolbox.print.spin('Moving Splash Assets');
                    await toolbox.system.run(`cd ${TEMP_FOLDER} && ${copySplashFilesCommand(TEMPLATES_FOLDER, folder, branch.name)}`, { trim: true });
                    spinner.succeed(`${branch.name} Splash Images Moved`);
                }

                // push repositories to github
                spinner = toolbox.print.spin('Pushing Branch to GitHub');
                await toolbox.system.run(createBranchesCommand(repository, folder, `automated-update/${branch.name}-${now}`, true), { trim: true });
                spinner.succeed(`${branch.name} Pushed to GitHub`);

                // create a PR
                spinner = toolbox.print.spin('Making Pull Request');
                // await toolbox.system.run(createBranchesCommand(repository, folder, pr ? `automated-update/${branch.name}` : branch.name, update), { trim: true });
                await toolbox.github.createPullRequest(repository, `automated-update/${branch.name}-${now}`, branch.name, 'Updated Meta Data (Automated from CLI)', '- Updated the meta files to the latest version from the example_template');
                spinner.succeed(`${branch.name} Pull Request created`);
            }

            // clean up the temporary directory
            spinner = toolbox.print.spin('Cleaning Up Temp Files');
            await toolbox.system.run(`rm -rf ${TEMP_FOLDER}`, { trim: true });
            spinner.succeed('Temporary Files Removed');
        }
        catch (err) {
            if (spinner) spinner.fail(`Something went wrong (${err.code})`);
            else {
                print.error(`Something went wrong (${err.code})`);
            }
            print.error(err.message);
            process.exit(1);
        }
    }

    // Attach github tools to the toolbox
    toolbox.bash = {
        buildExampleRepository,
        updateExampleRepository,
        cloneLocalFrameworkFolders
    };
}