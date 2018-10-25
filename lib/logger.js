const chalk = require('chalk');
const util = require('util');
const log = console.log;
const format = util.format;
const prefix = '  ycr';
const sep = chalk.gray('.');
exports.log = function (...args) {
    const msg = format.apply(format, args);
    log(chalk.blue(prefix), sep, msg);
}
exports.fatal = function (...args) {
    if (args[0] instanceof Error) args[0] = args[0].message.trim();
    const msg = format.apply(format, args);
    log(chalk.red(prefix), sep, msg);
    process.exit();
}