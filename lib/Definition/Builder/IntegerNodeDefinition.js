var util = require('util');

var NumericNodeDefinition = JSymfony.Config.Definition.Builder.NumericNodeDefinition;
var IntegerNode = JSymfony.Config.Definition.IntegerNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.NumericNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function IntegerNodeDefinition(name, parent) {
    NumericNodeDefinition.call(this, name, parent);
}

util.inherits(IntegerNodeDefinition, NumericNodeDefinition);

/**
 * Instantiate a Node
 *
 * @return {IntegerNode}
 */
IntegerNodeDefinition.prototype._instantiateNode = function () {
    return new IntegerNode(this._name, this._parent, this._min, this._ma);
};

JSymfony.Config.Definition.Builder.IntegerNodeDefinition = module.exports = IntegerNodeDefinition;
