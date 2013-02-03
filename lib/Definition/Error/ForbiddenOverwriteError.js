var util = require('util');
var parent = JSymfony.Config.Definition.Error.InvalidConfigurationError;

function ForbiddenOverwriteError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(ForbiddenOverwriteError, parent);

ForbiddenOverwriteError.prototype.name = 'ForbiddenOverwriteError';


JSymfony.Config.Definition.Error.ForbiddenOverwriteError = module.exports = ForbiddenOverwriteError;
