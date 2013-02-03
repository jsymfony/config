var util = require('util');

var ScalarNodeDefinition = JSymfony.Config.Definition.Builder.ScalarNodeDefinition;
var BooleanNode = JSymfony.Config.Definition.BooleanNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.ScalarNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function BooleanNodeDefinition(name, parent) {
    ScalarNodeDefinition.call(this, name, parent);
    this._nullEquivalent = true;
}

util.inherits(BooleanNodeDefinition, ScalarNodeDefinition);

/**
 * Instantiate a Node
 *
 * @return {BooleanNode}
 */
BooleanNodeDefinition.prototype._instantiateNode = function () {
    return new BooleanNode(this._name, this._parent);
};

JSymfony.Config.Definition.Builder.BooleanNodeDefinition = module.exports = BooleanNodeDefinition;
