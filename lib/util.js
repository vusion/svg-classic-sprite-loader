const crypto = require('crypto');
exports.md5 = function (str) {
    const md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
};
