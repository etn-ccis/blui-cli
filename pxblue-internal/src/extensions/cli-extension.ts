import { GluegunToolbox } from 'gluegun'
import { Color } from 'colors';

// add your CLI-specific functionality here, which will then be accessible
// to your commands
module.exports = (toolbox: GluegunToolbox) => {
    const { print, strings } = toolbox;
    const { colors, info } = print;
    const { success, error, muted } = colors;
    const { padEnd, startCase } = strings;

    interface Question {
        question: string,
        required: boolean,
        type?: string,
        choices?: Array<string>
    }

    const fancyBar = (padChar: string, length: number, color: Color = colors.blue.bold): void => {
        info(color(strings.pad('', length, padChar)));
    }
    const brokenBar = (padChar: string, length: number, gap: number, color: Color = colors.blue.bold): void => {
        info(color(
            strings.pad('', Math.floor((length - gap) / 2), padChar) +
            strings.pad('', gap) +
            strings.pad('', Math.ceil((length - gap) / 2), padChar)
        ));
    }
    const fancyCenter = (text: string, padChar: string, length: number, padCount: number, padColor: Color = colors.blue.bold, textColor: Color = colors.white.bold): void => {
        info(
            padColor(strings.padEnd(strings.pad('', padCount, padChar), Math.floor((length - text.length) / 2))) +
            textColor(text) +
            padColor(strings.padStart(strings.pad('', padCount, padChar), Math.ceil((length - text.length) / 2)))
        )
    }

    toolbox.fancyPrint = {
        bar: fancyBar,
        centered: fancyCenter,
        brokenBar
    }

    toolbox.isNull = (val: any): boolean => {
        return val === null || val === undefined;
    }

    toolbox.countRow = (label: string, list: Array<any>, padLength: number = 15): string => {
        return `${padEnd(startCase(label), padLength, ' ')}${toolbox.isNull(list) ? error('NOT FOUND') : success(list.length.toString())}`;
    }

    toolbox.printList = (list: Array<any>): string => {
        return `${toolbox.isNull(list) ? '--' : muted(list.join('\n'))}`;
    }

    toolbox.countString = (list: Array<any>): number => {
        return toolbox.isNull(list) ? 0 : list.length;
    }

    toolbox.parse = async (query: Array<Question> = [{ question: "Which Repository?", required: true }]): Promise<Array<string>> => {
        if (query.length < 1) return [];

        let params = [...toolbox.parameters.array];
        let questions = [];
        let promptResult: object;

        for (let i = params.length; i < query.length; i++) {
            questions.push({
                type: query[i].type || 'input',
                name: `param${i}`,
                message: query[i].question,
                choices: query[i].choices
            })
        }

        if (questions.length < 1) return params;

        promptResult = await toolbox.prompt.ask(questions);
        if (!promptResult) {
            toolbox.print.error('No input specified');
            process.exit(1);
        }
        for (let i = 0; i < query.length; i++) {
            if (params[i]) continue;
            if (promptResult[`param${i}`]) {
                params[i] = promptResult[`param${i}`]
            }
            else if (query[i].required) {
                toolbox.print.error('Missing Required Parameters');
                process.exit(1);
            }
            else {
                params[i] = '';
            }
        }
        return params;
    }

    // enable this if you want to read configuration in from
    // the current folder's package.json (in a "pxb" property),
    // pxb.config.json, etc.
    // toolbox.config = {
    //   ...toolbox.config,
    //   ...toolbox.config.loadConfig(process.cwd(), "pxb")
    // }
}