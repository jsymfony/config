var util = require('util');

var NumericNode = JSymfony.Config.Definition.NumericNode;
var fn = JSymfony.fn;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;

/**
 * This node represents a integer value in the config tree.
 *
 * @extends {JSymfony.Config.Definition.NumericNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 * @param {number} max
 * @param {number} min
 */
function IntegerNode(name, parent, min, max) {
    NumericNode.call(this, name, parent, min, max);
}

util.inherits(IntegerNode, NumericNode);

IntegerNode.prototype._validateType = function (value) {
    if (!fn.isInteger(value)) {
        var ex = new InvalidTypeError(fn.sprintf('Invalid type for path "%s". Expected Integer, but got %s.', this.getPath(), typeof value));
        ex.setPath(this.getPath());

        throw ex;
    }
};

JSymfony.Config.Definition.IntegerNode = module.exports = IntegerNode;
