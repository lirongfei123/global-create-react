const path = require('path');
const fs = require('fs');
module.exports = {
    resolveLoader: function (loaderName) {
        return path.join(__dirname, '../node_modules/' + loaderName);
    },
    resolvePreset: function (preset) {
        return path.join(__dirname, '../node_modules/babel-preset-' + preset);
    }
}