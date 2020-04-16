import { build, GluegunToolbox } from 'gluegun'

/**
 * Create the cli and kick it off
 */
async function run(argv?: string[] | string): Promise<GluegunToolbox> {
    // create a CLI runtime
    const cli = build()
        .brand('pxb')
        .src(__dirname)
        .plugins('./node_modules', { matching: 'pxb-*', hidden: true })
        .help() // provides default for help, h, --help, -h
        .defaultCommand({
            run: async (toolbox: GluegunToolbox) => {
                toolbox.print.info(
                    'Welcome to the PX Blue CLI! Type "pxb --help" for a list of available commands.'
                )
                toolbox.print.info(`v${toolbox.meta.version()}`)
            }
        })
        .checkForUpdates(5)
        .version({
            name: 'version',
            alias: ['v'],
            dashed: true,
            run: async (toolbox: GluegunToolbox) => {
                const { print, meta, fancyPrint } = toolbox
                const { colors, info } = print
                const version = meta.version()

                // Print out the fancy version ASCII
                info('')
                fancyPrint.bar('•', 40)
                fancyPrint.brokenBar('•', 40, 22)
                fancyPrint.centered('Power Xpert Blue CLI', '•', 40, 7)
                fancyPrint.brokenBar('•', 40, 22)
                fancyPrint.bar('•', 40)
                fancyPrint.brokenBar('•', 40, 34)
                fancyPrint.centered(
                    `v${version}`,
                    '•',
                    40,
                    3,
                    colors.blue.bold,
                    colors.green.bold
                )
                fancyPrint.brokenBar('•', 40, 34)
                fancyPrint.bar('•', 40)
                info('')
            }
        })
        .create()

    // and run it
    const toolbox = await cli.run(argv)

    // send it back (for testing, mostly)
    return toolbox
}

module.exports = { run }
