var fn = JSymfony.fn;
var NS = JSymfony.Config.Definition.Builder;

/**
 * This class provides a fluent interface for building a node.
 *
 * @constructor
 */
function NodeBuilder() {
    this._parent = null;
    this._nodeMapping = {
        variable: NS.VariableNodeDefinition,
        scalar: NS.ScalarNodeDefinition,
        boolean: NS.BooleanNodeDefinition,
        integer: NS.IntegerNodeDefinition,
        float: NS.FloatNodeDefinition,
        array: NS.ArrayNodeDefinition,
        enum: NS.EnumNodeDefinition
    };
}

NodeBuilder.prototype.setParent = function (parent) {
    this._parent = parent;
    return this;
};

NodeBuilder.prototype.arrayNode = function (name) {
    return this.node(name, 'array');
};

NodeBuilder.prototype.scalarNode = function (name) {
    return this.node(name, 'scalar');
};

NodeBuilder.prototype.booleanNode = function (name) {
    return this.node(name, 'boolean');
};

NodeBuilder.prototype.integerNode = function (name) {
    return this.node(name, 'integer');
};

NodeBuilder.prototype.floatNode = function (name) {
    return this.node(name, 'float');
};

NodeBuilder.prototype.enumNode = function (name) {
    return this.node(name, 'enum');
};

NodeBuilder.prototype.variableNode = function (name) {
    return this.node(name, 'variable');
};

NodeBuilder.prototype.end = function () {
    return this._parent;
};

NodeBuilder.prototype.node = function (name, type) {
    var Constructor = this.getNodeClass(type);

    var node = new Constructor(name);

    this.append(node);

    return node;
};

NodeBuilder.prototype.append = function (node) {
     if (node instanceof NS.ParentNodeDefinitionInterface) {
         var builder = this.clone();
         builder.setParent(null);
         node.setBuilder(builder);
     }

    if (this._parent) {
        this._parent.append(node);
        node.setParent(this);
    }

    return this;
};

NodeBuilder.prototype.setNodeClass = function(type, constructor) {
    this._nodeMapping[type.toLowerCase()] = constructor;
};

NodeBuilder.prototype.getNodeClass = function (type) {
    type = type.toLowerCase();

    if (!this._nodeMapping.hasOwnProperty(type)) {
        throw new JSymfony.RuntimeError('The node type "' + type + '" is not registered');
    }

    if (!this._nodeMapping[type]) {
        throw new JSymfony.RuntimeError('The node class for type "' + type + '" does not exist.');
    }

    return this._nodeMapping[type];
};

NodeBuilder.prototype.clone = function (builder) {
    builder = builder || new NodeBuilder();
    builder._parent = this._parent;
    builder._nodeMapping = fn.clone(this._nodeMapping);
    return builder;
};



JSymfony.Config.Definition.Builder.NodeBuilder = module.exports = NodeBuilder;
