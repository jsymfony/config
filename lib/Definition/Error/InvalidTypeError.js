var util = require('util');
var parent = JSymfony.Config.Definition.Error.InvalidConfigurationError;

function InvalidTypeError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(InvalidTypeError, parent);

InvalidTypeError.prototype.name = 'InvalidTypeError';


JSymfony.Config.Definition.Error.InvalidTypeError = module.exports = InvalidTypeError;
