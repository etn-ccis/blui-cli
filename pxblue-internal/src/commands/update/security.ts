import { GluegunToolbox } from 'gluegun';

module.exports = {
    name: 'security',
    description: 'Updates respository to enable vulnerability notifications, but disable automated fixes.',
    run: async (toolbox: GluegunToolbox) => {
        // retrieve the toolbox tools
        const { parse, github } = toolbox;

        // get the repository input
        const [name] = await parse([
            { question: 'Repository Name:', required: true },
        ]);

        const timer = toolbox.system.startTimer();

        github.setVulnerabilityAlerts(name);
        github.setVulnerabilityUpdates(name);
        
        toolbox.print.success(`Security settings updated in ${timer() / 1000} seconds`);
    }
}