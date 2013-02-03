var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var fn = JSymfony.fn;

function FileLocator(paths) {
    this._paths = fn.castArray(paths);
}

FileLocator.prototype.locateAll = function (name, currentPath) {
    if (JSymfony.fn.isAbsolutePath(name)) {
        if (!fs.existsSync(name)) {
            throw new JSymfony.InvalidArgumentError('The file "' + name + '" does not exist.');
        }
        return [name];
    }

    var filePaths = [];
    var file;

    var dirs = [];
    if (currentPath) {
        dirs.push(currentPath);
    }

    dirs = dirs.concat(this._paths);

    for (var i = 0; i < dirs.length; i++) {
        file = path.join(dirs[i], name);
        if (fs.existsSync(file)) {
            filePaths.push(file);
        }
    }

    if (!filePaths.length) {
        throw new JSymfony.InvalidArgumentError(JSymfony.fn.sprintf('The file "%s" does not exist (in: %s).', name, dirs.join(', ')));
    }

    return _.uniq(filePaths);
};

FileLocator.prototype.locate = function (name, currentPath) {
    return this.locateAll(name, currentPath)[0];
};

JSymfony.Config.FileLocator = module.exports = FileLocator;
