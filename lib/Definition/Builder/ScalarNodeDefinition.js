var util = require('util');

var VariableNodeDefinition = JSymfony.Config.Definition.Builder.VariableNodeDefinition;
var ScalarNode = JSymfony.Config.Definition.ScalarNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.VariableNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function ScalarNodeDefinition(name, parent) {
    VariableNodeDefinition.call(this, name, parent);
}

util.inherits(ScalarNodeDefinition, VariableNodeDefinition);

/**
 * Instantiate a Node
 *
 * @return {ScalarNode}
 */
ScalarNodeDefinition.prototype._instantiateNode = function () {
    return new ScalarNode(this._name, this._parent);
};


JSymfony.Config.Definition.Builder.ScalarNodeDefinition = module.exports = ScalarNodeDefinition;
