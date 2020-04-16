import { GluegunToolbox } from 'gluegun';
import { EXAMPLE_BRANCHES } from '../constants';

module.exports = {
    name: 'clone',
    alias: 'c',
    description: 'Clones branches from the specified repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse } = toolbox;

        // get the repository input
        const [repository, branch] = await parse([
            { question: 'Repository Name:', required: true },
            { question: 'Which Branch (or "all"):', required: false },
        ]);
        let branches = [];
        if (branch === 'all') branches = EXAMPLE_BRANCHES;
        else branches = EXAMPLE_BRANCHES.filter((br) => br.name === branch);

        const timer = toolbox.system.startTimer();
        await toolbox.bash.cloneLocalFrameworkFolders(repository, branches);
        toolbox.print.success(`Cloned branch(es) in ${timer() / 1000} seconds`);
    },
};
