import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'labels',
    description: 'Updates the Issue labels for the specified repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, github, status } = toolbox;

        // get the repository input
        const repository = (await parse())[0];

        const timer = toolbox.system.startTimer();
        await github.repairRepositoryLabels(repository);
        toolbox.print.success(`Updated labels in ${timer() / 1000} seconds`);

        status.printSingle(repository, true);
    },
};
