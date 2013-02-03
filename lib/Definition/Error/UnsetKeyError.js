var util = require('util');
var parent = JSymfony.Config.Definition.Error.DefinitionError;

function UnsetKeyError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(UnsetKeyError, parent);

UnsetKeyError.prototype.name = 'UnsetKeyError';


JSymfony.Config.Definition.Error.UnsetKeyError = module.exports = UnsetKeyError;
