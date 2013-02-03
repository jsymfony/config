var util = require('util');

var ScalarNode = JSymfony.Config.Definition.ScalarNode;
var fn = JSymfony.fn;
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;

/**
 * This node represents a numeric value in the config tree
 *
 * @extends {JSymfony.Config.Definition.ScalarNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 * @param {number} max
 * @param {number} min
 */
function NumericNode(name, parent, min, max) {
    ScalarNode.call(this, name, parent);
    this._min = min;
    this._max = max;
}

util.inherits(NumericNode, ScalarNode);

NumericNode.prototype._finalizeValue = function (value) {
    value = ScalarNode.prototype._finalizeValue.call(this, value);

    var errorMsg = '';
    if (typeof this._min !== 'undefined' && value < this._min) {
        errorMsg = fn.sprintf('The value %s is too small for path "%s". Should be greater than: %s', value, this.getPath(), this._min);
    }
    if (typeof this._max !== 'undefined' && value > this._max) {
        errorMsg = fn.sprintf('The value %s is too big for path "%s". Should be less than: %s', value, this.getPath(), this._max);
    }
    if (errorMsg) {
        var ex = new InvalidConfigurationError(errorMsg);
        ex.setPath(this.getPath());
        throw ex;
    }

    return value;
};

JSymfony.Config.Definition.NumericNode = module.exports = NumericNode;
