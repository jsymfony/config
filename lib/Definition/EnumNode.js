var util = require('util');

var ScalarNode = JSymfony.Config.Definition.ScalarNode;
var fn = JSymfony.fn;
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;

/**
 * Node which only allows a finite set of values.
 *
 * @extends {JSymfony.Config.Definition.ScalarNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 * @param {Array} values
 */
function EnumNode(name, parent, values) {
    if (values.length <= 1) {
        throw new JSymfony.InvalidArgumentError('values must contain at least two distinct elements');
    }

    ScalarNode.call(this, name, parent);

    this._values = values;
}

util.inherits(EnumNode, ScalarNode);

EnumNode.prototype.getValues = function () {
    return this._values;
};

EnumNode.prototype._finalizeValue = function (value) {
    value = ScalarNode.prototype._finalizeValue.call(this, value);
    if (this._values.indexOf(value) == -1) {
        var ex = new InvalidConfigurationError(fn.sprintf(
            'The value %s is not allowed for path "%s". Permissible values: %s',
            JSON.stringify(value),
            this.getPath(),
            JSON.stringify(this._values)
        ));
        ex.setPath(this.getPath());
        throw ex;
    }
    return value;
};



JSymfony.Config.Definition.EnumNode = module.exports = EnumNode;
