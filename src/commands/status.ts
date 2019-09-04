import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'status',
    alias: 's',
    description: 'Displays the setup status for the specified repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, status } = toolbox;

        // Print out the repository status(es)
        if (toolbox.parameters.options.all) {
            status.printAll();
        }
        else {
            const repository = (await parse())[0];
            status.printSingle(repository);
        }
    }
}