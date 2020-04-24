import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'branches',
    alias: 'b',
    description: 'Adds any missing branches to the specified repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, github, status } = toolbox;

        // get the repository input
        const [repository, description] = await parse([
            { question: 'Repository Name:', required: true },
            { question: 'Description', required: false },
        ]);

        const timer = toolbox.system.startTimer();
        await github.repairMissingBranches(repository, description);
        toolbox.print.success(`Updated branches in ${timer() / 1000} seconds`);

        status.printSingle(repository, true);
    },
};
