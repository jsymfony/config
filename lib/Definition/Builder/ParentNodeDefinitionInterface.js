/**
 * An interface that must be implemented by nodes which can have children
 *
 * @constructor
 */
function ParentNodeDefinitionInterface() {

}

ParentNodeDefinitionInterface.prototype.children = function () {};

/**
 * @param {JSymfony.Config.Definition.Builder.NodeDefinition} node
 */
ParentNodeDefinitionInterface.prototype.append = function (node) {};

/**
 * @param {JSymfony.Config.Definition.Builder.NodeBuilder} builder
 */
ParentNodeDefinitionInterface.prototype.setBuilder = function (builder) {};

JSymfony.Config.Definition.Builder.ParentNodeDefinitionInterface = module.exports = ParentNodeDefinitionInterface;
