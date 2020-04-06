import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'new',
    alias: ['n'],
    description: 'Creates a new project',
    run: async (toolbox: GluegunToolbox) => {
        const { parse, print, createProject } = toolbox;

        const [framework] = await parse([
            { question: 'Project Framework:', required: true, type: 'radio', choices: ['Angular', 'React', 'Ionic', 'React Native'] },
        ]);

        switch(framework){
            case 'Angular': 
                createProject.angular();
                break;
            case 'React':
                createProject.react();
                break;
            case 'Ionic':
                createProject.ionic();
                break;
            case 'React Native':
                createProject.reactNative();
                break;
            default:
                print.error('You must choose one of the supported frameworks.')
                return;
        }
    }
}

