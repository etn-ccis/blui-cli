import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'project',
    alias: ['p'],
    description: 'Creates a new project in the specified framework',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, projects, print } = toolbox;
        let js = toolbox.parameters.options.javascript || false;

        let [framework, dependencies, name] = await parse([
            { question: 'Project Framework:', required: true, type: 'radio', choices: ['Angular', 'React', 'Ionic', 'React Native'] },
            { question: 'Install dependencies', required: true, type: 'radio', choices: ['Yes', 'No'] },
            { question: 'Project Name', required: false }
        ]);
        framework = framework.toLowerCase().replace(/[- ]/ig, '');
        if (framework === 'react' || framework === 'reactnative') {
            if (!js) {
                let [useJS] = await parse([
                    { question: 'Language', required: true, type: 'radio', choices: ['TypeScript', 'JavaScript'] }
                ]);
                js = useJS === 'JavaScript';
            }
        }
        else {
            js = false;
        }

        let spinner = print.spin('Creating Project');
        const timer = toolbox.system.startTimer();
        await projects.create(framework, name, './', true, dependencies === 'No', js);
        spinner.stop();
        
        toolbox.print.success(`Created project in ${timer() / 1000} seconds`);
    }
}

