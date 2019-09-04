import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'project',
    alias: ['p'],
    description: 'Creates a new project in the specified framework',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, projects, print } = toolbox;

        let [framework, name ] = await parse([
            { question: 'Project Framework:', required: true, type: 'radio', choices: ['Angular', 'React', 'Ionic', 'React Native'] },
            { question: 'Project Name', required: false }
        ]);
        framework = framework.toLowerCase().replace(/[- ]/ig, '');

        let spinner = print.spin('Creating Project');
        const timer = toolbox.system.startTimer();
        await projects.create(framework, name, './', true, false);
        spinner.stop();
        toolbox.print.success(`Created project in ${timer() / 1000} seconds`);
    }
}

