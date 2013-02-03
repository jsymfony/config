var util = require('util');
var parent = JSymfony.Config.Definition.Error.InvalidConfigurationError;

function DuplicateKeyError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(DuplicateKeyError, parent);

DuplicateKeyError.prototype.name = 'DuplicateKeyError';


JSymfony.Config.Definition.Error.DuplicateKeyError = module.exports = DuplicateKeyError;
