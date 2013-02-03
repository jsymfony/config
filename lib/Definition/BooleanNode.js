var util = require('util');

var ScalarNode = JSymfony.Config.Definition.ScalarNode;
var fn = JSymfony.fn;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;

/**
 * This node represents a boolean value in the config tree
 *
 * @extends {JSymfony.Config.Definition.ScalarNode}
 * @constructor
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function BooleanNode(name, parent) {
    ScalarNode.call(this, name, parent);
}

util.inherits(BooleanNode, ScalarNode);

BooleanNode.prototype._validateType = function (value) {
    if (typeof value !== 'boolean') {
        var ex = new InvalidTypeError(fn.sprintf(
            'Invalid type for path "%s". Expected boolean, but got %s.',
            this.getPath(),
            typeof value
        ));
        ex.setPath(this.getPath());
        throw ex;
    }
};



JSymfony.Config.Definition.BooleanNode = module.exports = BooleanNode;
