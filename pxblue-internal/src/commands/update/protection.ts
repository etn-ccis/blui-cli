import { GluegunToolbox } from 'gluegun';
import { EXAMPLE_BRANCHES } from '../../constants';

module.exports = {
    name: 'protection',
    description: 'Updates branch protection rules for the specified repository/branch',
    run: async (toolbox: GluegunToolbox) => {
        // retrieve the toolbox tools
        const { parse, github } = toolbox;
        let branches = [];

        // get the repository input
        const [name, branch] = await parse([
            { question: 'Repository Name:', required: true },
            { question: 'Branch Name (or "all")', required: true },
        ]);

        const timer = toolbox.system.startTimer();
        if (branch.trim() !== 'all') branches.push(branch);
        else EXAMPLE_BRANCHES.forEach((br) => branches.push(br.name));

        branches.forEach((branch) => {
            if (toolbox.parameters.options.disabled) {
                github.removeBranchRestrictions(name, branch);
            } else github.addBranchRestrictions(name, branch);
        });

        toolbox.print.success(`Protection rules updated in ${timer() / 1000} seconds`);
    },
};
