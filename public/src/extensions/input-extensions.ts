/*
 * This file includes utilities for receiving input from the command line
 */

import { GluegunToolbox } from 'gluegun';
import { Question } from '../utilities';

module.exports = (toolbox: GluegunToolbox): void => {
    toolbox.parse = async (query: Question[]): Promise<(string | boolean)[]> => {
        // return if we have no questions to ask
        if (query.length < 1) return [];

        const params = { ...toolbox.parameters.options };
        const questions = [];
        const answers = [];

        // for each query, check if the params already have an answer to it
        for (let i = 0; i < query.length; i++) {
            // if the params already have answer, it will be the final answer
            // otherwise, we prepare for the answer to ask the user
            if (params[query[i].name] !== undefined) {
                // if this is a yes or no question
                // as long as the flag is there, we take that as a true
                if (query[i].type === 'confirm') {
                    answers[i] = true;
                }
                // if they are supposed to answer a multiple choice / text question,
                // and they provided something else other than just a flag,
                // we take their answer
                else if ((query[i].type === 'radio' || query[i].type === 'input') && params[query[i].name] !== true) {
                    answers[i] = params[query[i].name];
                }
            }
            // if there are still queries left unanswered, ask them
            if (answers[i] === undefined) {
                questions.push({
                    ...query[i],
                    type: query[i].type || 'input',
                    name: `param${i}`,
                    message: query[i].question || '',
                    choices: query[i].choices || [],
                });
            }
        }

        // we prompt users with our own questions
        const promptResult = await toolbox.prompt.ask(questions);
        if (!promptResult) {
            toolbox.print.error('No input specified');
            process.exit(1);
        }

        let questionCount = 0;
        // for each one of our queries, fill in the answers from the prompt
        for (let i = 0; i < query.length; i++) {
            // if the params already provide the answer, skip
            if (answers[i] !== undefined) {
                continue;
            }
            // break when we have put all the questions into our answers[]
            if (questionCount >= questions.length) {
                break;
            }

            // if this question is not answered by params
            // and we get something from the prompt, assign that
            if (answers[i] === undefined && promptResult[`param${questionCount}`]) {
                answers[i] = promptResult[`param${questionCount}`];
                questionCount++;
            } else {
                answers[i] = '';
                questionCount++;
            }
        }
        return answers;
    };
};
