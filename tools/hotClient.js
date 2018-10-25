const hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true');
hotClient.subscribe(function (message){
    if (message.action === 'reload') {
        location.reload();
    }
});