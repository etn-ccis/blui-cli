import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'meta',
    description: 'Updates meta data from the template repository',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, status, bash } = toolbox;

        // get the repository input
        const [repository, description ] = await parse([
            { question: 'Repository Name:', required: true },
            { question: 'New Description: ', required: false }
        ]);

        const timer = toolbox.system.startTimer();
        await bash.buildExampleRepository({repository, description, push: true, clean: true, update:true});
        toolbox.print.success(`Updated metadata in ${timer() / 1000} seconds`);

        status.printSingle(repository, true);
    }
}