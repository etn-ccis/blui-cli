import { GluegunToolbox } from 'gluegun';
import { MetaFiles } from '../../types';
import { EXAMPLE_BRANCHES } from '../../constants';

module.exports = {
    name: 'meta',
    description: 'Updates metadata from the template repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, status, bash } = toolbox;

        // get the repository input
        let description = '';
        const [repository, frameworks, meta] = await parse([
            { question: 'Repository Name:', required: true },
            {
                question: 'Which Branches?',
                required: true,
                type: 'multiselect',
                choices: ['angular', 'react', 'ionic', 'reactnative'],
            },
            {
                question: 'Which Meta Files?',
                required: true,
                type: 'multiselect',
                choices: ['README', 'CircleCI', 'LICENSE', 'gitignore', 'editorconfig', 'images'],
            },
        ]);
        if (meta.includes('README')) {
            description = (await parse([{ question: 'New Description: ', required: true }]))[0];
        }
        const timer = toolbox.system.startTimer();
        const update: MetaFiles = {
            readme: meta.includes('README'),
            license: meta.includes('LICENSE'),
            ignore: meta.includes('gitignore'),
            editor: meta.includes('editorconfig'),
            circle: meta.includes('CircleCI'),
            images: meta.includes('images'),
        };

        const branches = EXAMPLE_BRANCHES.filter((b) => frameworks.includes(b.name));
        await bash.updateExampleRepository({
            repository,
            branches,
            description,
            files: update,
        });
        toolbox.print.success(`Updated metadata in ${timer() / 1000} seconds`);

        status.printSingle(repository, true);
    },
};
