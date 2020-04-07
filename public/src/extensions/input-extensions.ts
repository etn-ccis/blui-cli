/*
 * This file includes utilities for receiving input from the command line
 */

import { GluegunToolbox } from 'gluegun';

module.exports = (toolbox: GluegunToolbox): void => {
    type Question = {
        question: string;
        required: boolean;
        type?: string;
        choices?: string[];
    };

    toolbox.parse = async (query: Question[]): Promise<string[]> => {
        if (query.length < 1) return [];

        const params = [...toolbox.parameters.array];
        const questions = [];

        for (let i = params.length; i < query.length; i++) {
            questions.push({
                type: query[i].type || 'input',
                name: `param${i}`,
                message: query[i].question,
                choices: query[i].choices,
            });
        }

        if (questions.length < 1) return params;

        const promptResult = await toolbox.prompt.ask(questions);
        if (!promptResult) {
            toolbox.print.error('No input specified');
            process.exit(1);
        }
        for (let i = 0; i < query.length; i++) {
            if (params[i]) continue;
            if (promptResult[`param${i}`]) {
                params[i] = promptResult[`param${i}`];
            } else if (query[i].required) {
                toolbox.print.error('Missing Required Parameters');
                process.exit(1);
            } else {
                params[i] = '';
            }
        }
        return params;
    };
};
