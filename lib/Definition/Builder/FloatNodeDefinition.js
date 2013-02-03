var util = require('util');

var NumericNodeDefinition = JSymfony.Config.Definition.Builder.NumericNodeDefinition;
var FloatNode = JSymfony.Config.Definition.FloatNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.NumericNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function FloatNodeDefinition(name, parent) {
    NumericNodeDefinition.call(this, name, parent);
}

util.inherits(FloatNodeDefinition, NumericNodeDefinition);

/**
 * Instantiate a Node
 *
 * @return {FloatNode}
 */
FloatNodeDefinition.prototype._instantiateNode = function () {
    return new FloatNode(this._name, this._parent, this._min, this._ma);
};

JSymfony.Config.Definition.Builder.FloatNodeDefinition = module.exports = FloatNodeDefinition;
