var util = require('util');
var _ = require('lodash');
var NodeDefinition = JSymfony.Config.Definition.Builder.NodeDefinition;
var NodeBuilder = JSymfony.Config.Definition.Builder.NodeBuilder;
var ArrayNode = JSymfony.Config.Definition.ArrayNode;
var PrototypedArrayNode = JSymfony.Config.Definition.PrototypedArrayNode;
var DefinitionError = JSymfony.Config.Definition.Error.DefinitionError;
var fn = JSymfony.fn;
/**
 * This class provides a fluent interface for defining an array node.
 *
 * @constructor
 * @extends {NodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function ArrayNodeDefinition(name, parent) {
    NodeDefinition.call(this, name, parent);

    this._performDeepMerging = true;
    this._ignoreExtraKeys = null;
    this._children = {};
    this._prototype = null;
    this._atLeastOne = false;
    this._allowNewKeys = true;
    this._key = null;
    this._removeKeyItem = null;
    this._addDefaults = false;
    this._addDefaultChildren = false;
    this._nodeBuilder = null;
    this._normalizaKeys = null;
    this._allowEmptyValue = true;
    this._nullEquivalent = [];
    this._trueEquivalent = [];
}

util.inherits(ArrayNodeDefinition, NodeDefinition);

/**
 * Sets a custom children builder.
 *
 * @param {NodeBuilder} builder
 */
ArrayNodeDefinition.prototype.setBuilder = function (builder) {
    this._nodeBuilder = builder;
};

/**
 * Returns a builder to add children nodes.
 *
 * @return {NodeBuilder}
 */
ArrayNodeDefinition.prototype.children = function () {
    return this._getNodeBuilder();
};

/**
 * Sets a prototype for child nodes.
 *
 * @param {string} type
 *
 * @return {NodeDefinition}
 */
ArrayNodeDefinition.prototype.setPrototype = function (type) {
    return this._prototype = this._getNodeBuilder().node(null, type).setParent(this);
};

/**
 * Adds the default value if the node is not set in the configuration.
 *
 * This method is applicable to concrete nodes only (not to prototype nodes).
 * If this function has been called and the node is not set during the finalization
 * phase, it's default value will be derived from its children default values.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.addDefaultsIfNotSet = function () {
    this._addDefaults = true;
    return this;
};

/**
 * Adds children with a default value when none are defined.
 *
 * @param {numeric|string|Array|null} children The number of children|The child name|The children names to be added
 *
 * This method is applicable to prototype nodes only.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.addDefaultChildrenIfNoneSet = function (children) {
    this._addDefaultChildren = children;
    return this;
};

/**
 * Requires the node to have at least one element
 *
 * This method is applicable to prototype nodes only
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.requiresAtLeastOneElement = function () {
    this._atLeastOne = true;
    return this;
};

/**
 * Disallows adding news keys in a subsequent configuration.
 *
 * If used all keys have to be defined in the same configuration file.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.disallowNewKeysInSubsequentConfigs = function () {
    this._allowNewKeys = false;
    return this;
};

/**
 * Sets the attribute which value is to be used as key.
 *
 * This is useful when you have an indexed array that should be an
 * associative array. You can select an item from within the array
 * to be the key of the particular item. For example, if "id" is the
 * "key", then:
 *
 *   [{id: 'my_name', foo: 'bar'}]
 *
 * becomes
 *
 *   {my_name: {foor: 'bar'}}
 *
 * If you'd like "id: 'my_name'" to still be present in the resulting
 * array, then you can set the second argument of this method to false.
 *
 * This method is applicable to prototype nodes only.
 *
 * @param {string} name
 * @param {boolean} removeKeyItem
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.useAttributeAsKey = function (name, removeKeyItem) {
    if (typeof removeKeyItem === 'undefined') {
        removeKeyItem = true;
    }
    this._key = name;
    this._removeKeyItem = removeKeyItem;

    return this;
};

/**
 * Sets whether the node can be unset.
 *
 * @param {boolean=} allow
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.canBeUnset = function (allow) {
    if (typeof allow === 'undefined') {
        allow = true;
    }
    this._merge().allowUnset(allow);
    return this;
};

/**
 * Adds an "enabled" boolean to enable the current section.
 *
 * By default, the section is disabled.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.canBeEnabled = function () {
    this.treatFalseLike({enabled: false})
        .treatTrueLike({enabled: true})
        .treatNullLike({enabled: true})
        .children()
            .booleanNode('enabled').defaultFalse();

    return this;
};

/**
 * Adds an "enabled" boolean to enable the current section.
 *
 * By default, the section is enabled.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.canBeDisabled = function () {
    this.treatFalseLike({enabled: false})
        .treatTrueLike({enabled: true})
        .treatNullLike({enabled: true})
        .children()
            .booleanNode('enabled').defaultTrue();

    return this;
};

/**
 * Disables the deep merging of the node
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.performNoDeepMerging = function () {
    this._performDeepMerging = false;
    return this;
};

/**
 * Allows extra config keys to be specified under an array without
 * throwing an exception.
 *
 * Those config values are simply ignored. This should be used only
 * in special cases where you want to send an entire configuration
 * array through a special tree that processes only part of the array.
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.ignoreExtraKeys = function () {
    this._ignoreExtraKeys = true;
    return this;
};

/**
 * Sets key normalization.
 *
 * @param {boolean} bool Whether to enable key normalization
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.normalizeKeys = function (bool) {
    this._normalizaKeys = bool;
    return this;
};

/**
 * Appends a node definition.
 * node = new ArrayNodeDefinition()
 *         ->children()
 *             ->scalarNode('foo')->end()
 *             ->scalarNode('baz')->end()
 *         ->end()
 *         ->append(this.getBarNodeDefinition())
 * ;
 *
 * @param {NodeDefinition} node
 *
 * @return {ArrayNodeDefinition}
 */
ArrayNodeDefinition.prototype.append = function (node) {
    this._children[node._name] = node.setParent(this);
    return this;
};

/**
 * Returns a node builder to be used to add children and prototype
 *
 * @return {NodeBuilder}
 *
 * @protected
 */
ArrayNodeDefinition.prototype._getNodeBuilder = function () {
    if (!this._nodeBuilder) {
        this._nodeBuilder = new JSymfony.Config.Definition.Builder.NodeBuilder();
    }

    return this._nodeBuilder.setParent(this);
};

/**
 * @inheritDoc
 */
ArrayNodeDefinition.prototype._createNode = function () {
    var node;
    if (!this._prototype) {
        node = new ArrayNode(this._name, this._parent);

        this._validateConcreteNode(node);

        node.setAddIfNotSet(this._addDefaults);

        _.forOwn(this._children, function (child) {
            child.setParent(node);
            node.addChild(child.getNode());
        });
    } else {
        node = new PrototypedArrayNode(this._name, this._parent);

        this._validatePrototypeNode(node);

        if (this._key !== null) {
            node.setKeyAttribute(this._key, this._removeKeyItem);
        }

        if (this._atLeastOne) {
            node.setMinNumberOfElements(1);
        }

        if (this._default) {
            node.setDefaultValue(this._defaultValue);
        }

        if (this._addDefaultChildren !== false) {
            node.setAddChildrenIfNoneSet(this._addDefaultChildren);
            if (this._prototype instanceof ArrayNodeDefinition && null === this._prototype._prototype) {
                this._prototype.addDefaultsIfNotSet();
            }
        }

        this._prototype._parent = node;
        node.setPrototype(this._prototype.getNode());
    }


    node.setAllowNewKeys(this._allowNewKeys);
    node.addEquivalentValue(null, this._nullEquivalent);
    node.addEquivalentValue(true, this._trueEquivalent);
    node.addEquivalentValue(false, this._falseEquivalent);
    node.setPerformDeepMerging(this._performDeepMerging);
    node.setRequired(this._required);
    node.setIgnoreExtraKeys(this._ignoreExtraKeys);
    node.setNormalizeKeys(this._normalizaKeys);

    if (this._normalizationBuilder) {
        node.setNormalizationClosures(this._normalizationBuilder.getBeforeClosures());
    }

    if (this._mergeBuilder) {
        node.setAllowOverwrite(this._mergeBuilder.getAllowOverwrite());
        node.setAllowFalse(this._mergeBuilder.getAllowFalse());
    }

    if (this._validationBuilder) {
        node.setFinalValidationClosures(this._validationBuilder.getRules());
    }

    return node;
};

/**
 * Validate the configuration of a concrete node.
 *
 * @param {ArrayNode} node The related node
 * @protected
 */
ArrayNodeDefinition.prototype._validateConcreteNode = function(node) {
    var path = node.getPath();

    if (null !== this._key) {
        throw new DefinitionError('->useAttributeAsKey() is not applicable to concrete nodes at path "' + path + '"');
    }

    if (this._atLeastOne) {
        throw new DefinitionError('->requiresAtLeastOneElement() is not applicable to concrete nodes at path "' + path + '"');
    }

    if (this._default) {
        throw new DefinitionError('->defaultValue() is not applicable to concrete nodes at path "' + path + '"');
    }

    if (this._addDefaultChildren !== false) {
        throw new DefinitionError('->addDefaultChildrenIfNoneSet() is not applicable to concrete nodes at path "' + path + '"');
    }
};

/**
 * Validate the configuration of a prototype node.
 *
 * @param {PrototypedArrayNode} node
 *
 * @protected
 */
ArrayNodeDefinition.prototype._validatePrototypeNode = function (node) {
    var path = node.getPath();

    if (this._addDefaults) {
        throw new DefinitionError('->addDefaultsIfNotSet() is not applicable to prototype nodes at path "' + path +'"');
    }

    if (this._addDefaultChildren !== false) {
        if (this._default) {
            throw new DefinitionError('A default value and default children might not be used together at path "' + path + '"');
        }

        if (null !== this._key && (null === this._addDefaultChildren || fn.isInteger(this._addDefaultChildren) &&  this._addDefaultChildren > 0)) {
            throw new DefinitionError('->addDefaultChildrenIfNoneSet() should set default children names as ->useAttributeAsKey() is used at path "' + path + '"');
        }

        if (null === this._key && (typeof this._addDefaultChildren === 'string' || _.isArray(this._addDefaultChildren))) {
            throw new DefinitionError('->addDefaultChildrenIfNoneSet() might not set default children names as ->useAttributeAsKey() is not used at path "' + path + '"');
        }
    }
};

JSymfony.Config.Definition.Builder.ArrayNodeDefinition = module.exports = ArrayNodeDefinition;
