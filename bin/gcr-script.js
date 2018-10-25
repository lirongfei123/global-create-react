#!/usr/bin/env node

const crossSpawn = require('cross-spawn');
const path = require('path');
const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
    x => /^(?:build|start)$/.test(x)
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
const nodeArgs = args.slice(1, scriptIndex);
switch(script) {
    case 'start':
    {
        crossSpawn.sync(
            'node',
            [path.join(__dirname, `../tools/${script}`)].concat(nodeArgs),
            {
                stdio: 'inherit'
            }
        );
        break;
    }
    case 'build': {
        crossSpawn.sync(
            'webpack',
            ['--config', path.join(__dirname, `../tools/webpack.config.js`), '--release'],
            {
                stdio: 'inherit'
            }
        );
        break;
    }
    default: {

    }
}