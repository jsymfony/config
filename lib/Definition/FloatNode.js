var util = require('util');

var NumericNode = JSymfony.Config.Definition.NumericNode;
var fn = JSymfony.fn;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;

/**
 * This node represents a float value in the config tree.
 *
 * @extends {JSymfony.Config.Definition.NumericNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 * @param {number} max
 * @param {number} min
 */
function FloatNode(name, parent, min, max) {
    NumericNode.call(this, name, parent, min, max);
}

util.inherits(FloatNode, NumericNode);

FloatNode.prototype._validateType = function (value) {
    if (!fn.isInteger(value) && !fn.isFloat(value)) {
        var ex = new InvalidTypeError(fn.sprintf('Invalid type for path "%s". Expected float, but got %s.', this.getPath(), typeof value));
        ex.setPath(this.getPath());

        throw ex;
    }
};

JSymfony.Config.Definition.FloatNode = module.exports = FloatNode;
