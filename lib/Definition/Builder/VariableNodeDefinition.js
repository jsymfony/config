var util = require('util');

var NodeDefinition = JSymfony.Config.Definition.Builder.NodeDefinition;
var VariableNode = JSymfony.Config.Definition.VariableNode;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.Builder.NodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function VariableNodeDefinition(name, parent) {
    NodeDefinition.call(this, name, parent);
}

util.inherits(VariableNodeDefinition, NodeDefinition);

/**
 * Instantiate a Node
 *
 * @return {VariableNode}
 */
VariableNodeDefinition.prototype._instantiateNode = function () {
    return new VariableNode(this._name, this._parent);
};

VariableNodeDefinition.prototype._createNode = function () {
    var node = this._instantiateNode();

    if (this._normalizationBuilder) {
        node.setNormalizationClosures(this._normalizationBuilder.getBeforeClosures());
    }

    if (this._mergeBuilder) {
        node.setAllowOverwrite(this._mergeBuilder.getAllowOverwrite());
    }

    if (this._default === true) {
        node.setDefaultValue(this._defaultValue);
    }

    if (this._allowEmptyValue === false) {
        node.setAllowEmptyValue(this._allowEmptyValue);
    }

    node.addEquivalentValue(null, this._nullEquivalent);
    node.addEquivalentValue(true, this._trueEquivalent);
    node.addEquivalentValue(false, this._falseEquivalent);
    node.setRequired(this._required);

    if (this._validationBuilder) {
        node.setFinalValidationClosures(this._validationBuilder.getRules());
    }

    return node;
};

JSymfony.Config.Definition.Builder.VariableNodeDefinition = module.exports = VariableNodeDefinition;
