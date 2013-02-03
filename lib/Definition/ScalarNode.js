var util = require('util');

var VariableNode = JSymfony.Config.Definition.VariableNode;
var fn = JSymfony.fn;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;

/**
 * This node represents a scalar value in the config tree.
 *
 * The following values are considered scalars:
 *   * booleans
 *   * numbers
 *   * strings
 *   * null
 *
 * @extends {JSymfony.Config.Definition.VariableNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function ScalarNode(name, parent) {
    VariableNode.call(this, name, parent);
}

util.inherits(ScalarNode, VariableNode);

ScalarNode.prototype._validateType = function (value) {
    if (!fn.isScalar(value) && value !== null) {
        var ex = new InvalidTypeError(fn.sprintf(
            'Invalid type for path "%s". Expected scalar, but got %s.',
            this.getPath(),
            typeof value
        ));
        ex.setPath(this.getPath());

        throw ex;
    }
};

JSymfony.Config.Definition.ScalarNode = module.exports = ScalarNode;
