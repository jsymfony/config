var util = require('util');

var ScalarNodeDefinition = JSymfony.Config.Definition.Builder.ScalarNodeDefinition;
var EnumNode = JSymfony.Config.Definition.EnumNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.ScalarNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function EnumNodeDefinition(name, parent) {
    ScalarNodeDefinition.call(this, name, parent);
    this._valies = null;
}

util.inherits(EnumNodeDefinition, ScalarNodeDefinition);

EnumNodeDefinition.prototype.values = function (values) {
    if (values.length <= 1) {
        throw new JSymfony.InvalidArgumentError('->values() must be called with at least two distinct values.');
    }

    this._values = values;

    return this;
};

/**
 * Instantiate a Node
 *
 * @return {EnumNode}
 */
EnumNodeDefinition.prototype._instantiateNode = function () {
    if (!this._values) {
        throw new JSymfony.RuntimeError('You must call ->values() on enum nodes.');
    }
    return new EnumNode(this._name, this._parent);
};

JSymfony.Config.Definition.Builder.EnumNodeDefinition = module.exports = EnumNodeDefinition;
