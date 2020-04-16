import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'repository',
    alias: ['repo'],
    description: 'Creates a new github repository with correct templates and branch structure',
    run: async (toolbox: GluegunToolbox) => {
        // retrieve the toolbox tools
        const { parse, github } = toolbox;

        // get the repository input
        const [name, description] = await parse([
            { question: 'Repository Name:', required: true },
            { question: 'This project demonstrates how to: ', required: false },
        ]);

        // create the repository
        if (name && description) {
            const timer = toolbox.system.startTimer();
            await github.createRepository(name, description);
            toolbox.print.success(`Repository created in ${timer() / 1000} seconds`);
        }
    },
};
