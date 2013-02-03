var util = require('util');
var parent = JSymfony.RuntimeError;

function DefinitionError(message, code, previous) {
    parent.call(this, message, code, previous)
}

util.inherits(DefinitionError, parent);

DefinitionError.prototype.name = 'DefinitionError';


JSymfony.Config.Definition.Error.DefinitionError = module.exports = DefinitionError;
