const { system, filesystem } = require('gluegun');
const packageJSON = require('../package.json');

const src = filesystem.path(__dirname, '..');

const cli = async (cmd) => system.run('node ' + filesystem.path(src, 'bin', 'pxb') + ` ${cmd}`);

test('outputs version', async () => {
    const output = await cli('--version');
    expect(output).toContain(packageJSON.version);
});

test('outputs help', async () => {
    const output = await cli('--help');
    expect(output).toContain(packageJSON.version);
});
