var util = require('util');
var parent = JSymfony.Config.Definition.Error.DefinitionError;

function InvalidConfigurationError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(InvalidConfigurationError, parent);

InvalidConfigurationError.prototype.name = 'InvalidConfigurationError';

InvalidConfigurationError.prototype._path = null;

InvalidConfigurationError.prototype.setPath = function (path) {
    this._path = path;
};

InvalidConfigurationError.prototype.getPath = function () {
    return this._path;
};

JSymfony.Config.Definition.Error.InvalidConfigurationError = module.exports = InvalidConfigurationError;
