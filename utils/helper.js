var path = require('path');

module.exports.getParamValue = function (param) {
    return path.resolve(process.cwd(), param).split('=')[1]
}
