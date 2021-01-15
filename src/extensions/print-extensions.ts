/*
 * This file includes utilities for fancy printing to the console.
 */
import { GluegunToolbox } from 'gluegun';
import { Color } from 'colors';

module.exports = (toolbox: GluegunToolbox): void => {
    const { print, strings } = toolbox;
    const { colors, info } = print;
    const { padEnd, padStart } = strings;

    const printDivider = (character: string, length: number, color: Color = colors.blue.bold): void => {
        info(color(strings.pad('', length, character)));
    };
    const printBookends = (character: string, length: number, gap: number, color: Color = colors.blue.bold): void => {
        info(
            color(
                strings.pad('', Math.floor((length - gap) / 2), character) +
                    strings.pad('', gap) +
                    strings.pad('', Math.ceil((length - gap) / 2), character)
            )
        );
    };
    const printInfo = (
        text: string,
        padChar: string,
        length: number,
        padCount: number,
        padColor: Color = colors.blue.bold,
        textColor: Color = colors.white.bold
    ): void => {
        info(
            padColor(padEnd(strings.pad('', padCount, padChar), Math.floor((length - text.length) / 2))) +
                textColor(text) +
                padColor(padStart(strings.pad('', padCount, padChar), Math.ceil((length - text.length) / 2)))
        );
    };
    const printInfoLeft = (
        text: string,
        padChar: string,
        length: number,
        padCount: number,
        padColor: Color = colors.blue.bold,
        textColor: Color = colors.white.bold
    ): void => {
        info(
            `${padColor(padEnd(strings.pad('', padCount, padChar), padCount))}    ${textColor(text)}${padColor(
                padStart(strings.pad('', padCount, padChar), length - text.length - padCount - 4)
            )}`
        );
    };

    const printWelcomeLogo = (): void => {
        print.info('');
        print.info(colors.blue('                          ######'));
        print.info(colors.blue('                        ##    ### '));
        print.info(colors.blue('                ######  ##    ##  '));
        print.info(colors.blue('            ####           ##'));
        print.info(colors.blue('         ###'));
        print.info(colors.blue('       ###'));
        print.info(colors.blue('      ##                                        #'));
        print.info(colors.blue('    ###                                          # '));
        print.info(colors.blue('   ##                  ######                    #  '));
        print.info(colors.blue('  ##                #############                ## '));
        print.info(colors.blue(' ##                ###############               ##  '));
        print.info(colors.blue(' ##               #################               ##'));
        print.info(colors.blue(' ##                ###############                ## '));
        print.info(colors.blue('  ##                #############                ##'));
        print.info(colors.blue('   ##                   #####                   ## '));
        print.info(colors.blue('    ##                                         ##  '));
        print.info(colors.blue('     ##                                       ## '));
        print.info(colors.blue('      ###                                   ###  '));
        print.info(colors.blue('        ###                               ## '));
        print.info(colors.blue('           ####                       ####  '));
        print.info(colors.blue('               ######           #####   '));
        print.info(colors.blue('                       ###### '));
        print.info(colors.blue(''));
        print.info(colors.blue('             Welcome To Power Xpert Blue'));
        print.info(colors.white('        Powering Teams to Make What Matters *'));
        print.info('');
    };

    toolbox.fancyPrint = {
        divider: printDivider,
        bookends: printBookends,
        info: printInfo,
        infoLeft: printInfoLeft,
        welcomeLogo: printWelcomeLogo,
    };
};
