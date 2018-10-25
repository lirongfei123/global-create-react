const webpack = require('webpack');
const path = require('path');
const webpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
let webpackConfig = require('./webpack.config');
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
webpackConfig.plugins.push(new webpack.NamedModulesPlugin());
webpackConfig.entry.main.push(path.join(__dirname, '../node_modules/webpack-hot-middleware/client?noInfo=true&reload=true'));
const componentCompiler = webpack(webpackConfig);
const hotMiddleware = webpackHotMiddleware(componentCompiler);
const workPath = process.cwd();
const serverConfig = require(`${workPath}/config.js`);
const open = require('open');
const proxy = require('http-proxy-middleware');
const app = new webpackDevServer(componentCompiler,Object.assign({
    historyApiFallback: {
        rewrites: [
            {
                from: /^\//,
                to: '/static/index.html',
            }
        ]
    },
    publicPath: webpackConfig.output.publicPath,
    before(app) {
        app.use(hotMiddleware);
        serverConfig.before(app);
    },
    after(app) {
        serverConfig.after(app);
    }
}, serverConfig.devServer));
app.listen(serverConfig.port, serverConfig.address, function () {
    console.log('服务器启动', `http://${serverConfig.address}:${serverConfig.port}/index.html`);
    open(`http://${serverConfig.address}:${serverConfig.port}/index.html`);
});