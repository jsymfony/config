var util = require('util');
var NormalizationBuilder = JSymfony.Config.Definition.Builder.NormalizationBuilder;
var MergeBuilder = JSymfony.Config.Definition.Builder.MergeBuilder;
var ValidationBuilder = JSymfony.Config.Definition.Builder.ValidationBuilder;
var ExprBuilder = JSymfony.Config.Definition.Builder.ExprBuilder;

/**
 * This class provides a fluent interface for defining a node.
 *
 * @constructor
 * @abstract
 * @implements {JSymfony.Config.Definition.Builder.NodeParentInterface}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function NodeDefinition(name, parent) {
    this._parent = parent;
    this._name = name;
    this._default = false;
    this._required = false;
    this._trueEquivalent = true;
    this._falseEquivalent = false;
    this._attributes = {};
    this._normalizationBuilder = null;
    this._mergeBuilder = null;
    this._validationBuilder = null;
    this._defaultValue = null;
    this._nullEquivalent = null;
    this._allowEmptyValue = null;
}

util.inherits(NodeDefinition, JSymfony.Config.Definition.Builder.NodeParentInterface);

/**
 * Sets the parent node
 *
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.setParent = function (parent) {
    this._parent = parent;
    return this;
};

/**
 * Sets info message.
 * @param {string} info
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.info = function (info) {
    return this.attribute('info', info);
};

/**
 * Sets example configuration
 *
 * @param {string|array} example
 *
 * @return {NodeInterface}
 */
NodeDefinition.prototype.example = function (example) {
    return this.attribute('example', example);
};

/**
 * Sets an attribute on the node.
 *
 * @param {string} key
 * @param {*} value
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.attribute = function (key, value) {
    this._attributes[key] = value;

    return this;
};


/**
 * Returns the parent node.
 *
 * @return {JSymfony.Config.Definition.Builder.NodeParentInterface} The builder of the parent node
 */
NodeDefinition.prototype.end = function () {
    return this._parent;
};

/**
 * Creates the node
 *
 * @param {boolean} forceRootNode Whether to force this node as the root node
 *
 * @return {JSymfony.Config.Definition.NodeInterface}
 */
NodeDefinition.prototype.getNode = function (forceRootNode) {
    if (forceRootNode) {
        this._parent = null;
    }

    if (this._normalizationBuilder) {
        this._normalizationBuilder.setBeforeClosures(ExprBuilder.buildExpressions(this._normalizationBuilder.getBeforeClosures()));
    }

    if (this._validationBuilder) {
        this._validationBuilder.setRules(ExprBuilder.buildExpressions(this._validationBuilder.getRules()));
    }

    var node = this._createNode();
    node.setAttributes(this._attributes);

    return node;
};

/**
 * Sets the default value.
 *
 * @param {*} value
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.defaultValue = function (value) {
    this._default = true;
    this._defaultValue = value;
    return this;
};

/**
 * Sets the node as required.
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.required = function () {
    this._required = true;
    return this;
};

/**
 * Sets the equivalent value used when the node contains null.
 *
 * @param {*} value
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.treatNullLike = function (value) {
    this._nullEquivalent = value;
    return this;
};

/**
 * Sets the equivalent value used when the node contains true.
 *
 * @param {*} value
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.treatTrueLike = function (value) {
    this._trueEquivalent = value;
    return this;
};

/**
 * Sets the equivalent value used when the node contains false.
 *
 * @param {*} value
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.treatFalseLike = function (value) {
    this._falseEquivalent = value;
    return this;
};

/**
 * Sets null as the default value.
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.defaultNull = function () {
    return this.defaultValue(null);
};

/**
 * Sets true as the default value.
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.defaultTrue = function () {
    return this.defaultValue(true);
};

/**
 * Sets false as the default value.
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.defaultFalse = function () {
    return this.defaultValue(false);
};

/**
 * Sets an expression to run before the normalization.
 *
 * @return {JSymfony.Config.Definition.Builder.ExprBuilder}
 */
NodeDefinition.prototype.beforeNormalization = function () {
    return this._normalization().before();
};

/**
 * Denies the node value being empty.
 *
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.cannotBeEmpty = function () {
    this._allowEmptyValue = false;
    return this;
};

/**
 * Sets an expression to run for the validation.
 *
 * The expression receives the value of the node and must return it. It can modify it.
 * An exception should be thrown when the node is not valid.
 *
 * @return {JSymfony.Config.Definition.Builder.ExprBuilder}
 */
NodeDefinition.prototype.validate = function () {
    return this._validation().rule();
};

/**
 * Sets whether the node can be overwritten.
 *
 * @param {boolean} deny Whether the overwriting is forbidden or not
 * @return {NodeDefinition}
 */
NodeDefinition.prototype.cannotBeOverwritten = function (deny) {
    this._merge().denyOverwrite(deny);
    return this;
};

/**
 * Gets the builder for validation rules
 *
 * @protected
 * @return {JSymfony.Config.Definition.Builder.ValidationBuilder}
 */
NodeDefinition.prototype._validation = function () {
    if (!this._validationBuilder) {
        this._validationBuilder = new ValidationBuilder(this);
    }

    return this._validationBuilder;
};

/**
 * Gets the builder for merging rules.
 *
 * @protected
 *
 * @return {JSymfony.Config.Definition.Builder.MergeBuilder}
 */
NodeDefinition.prototype._merge = function () {
    if (!this._mergeBuilder) {
        this._mergeBuilder = new MergeBuilder(this);
    }

    return this._mergeBuilder;
};

/**
 * Gets the builder for normalization rules
 *
 * @protected
 * @return {JSymfony.Config.Definition.Builder.NormalizationBuilder}
 */
NodeDefinition.prototype._normalization = function () {
    if (!this._normalizationBuilder) {
        this._normalizationBuilder = new NormalizationBuilder(this);
    }
    return this._normalizationBuilder;
};


/**
 * Instantiate and configure the node according to this definition
 *
 * @abstract
 * @protected
 *
 * @return {JSymfony.Config.Definition.NodeInterface}
 */
NodeDefinition.prototype._createNode = function () {
    throw new JSymfony.NotImplementedError(this, '_createNode');
};

JSymfony.Config.Definition.Builder.NodeDefinition = module.exports = NodeDefinition;

