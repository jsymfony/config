var BaseNode = JSymfony.Config.Definition.BaseNode;
var util = require('util');
var fn = JSymfony.fn;
var _ = require('lodash');
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;
var UnsetKeyError = JSymfony.Config.Definition.Error.UnsetKeyError;

/**
 * Represents an Array node in the config tree
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.BaseNode}
 * @implements {JSymfony.Config.Definition.PrototypeNodeInterface}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function ArrayNode(name, parent) {
    BaseNode.call(this, name, parent);

    this._children = {};
    this._allowFalse = false;
    this._allowNewKeys = true;
    this._addIfNotSet = false;
    this._preformDeepMerging = true;
    this._ignoreExtraKeys = null;
    this._normalizeKeys = true;
    this._removeKeyAttribute = true;
}

util.inherits(ArrayNode, BaseNode);

ArrayNode.prototype.setNormalizeKeys = function (normalizeKeys) {
    this._normalizeKeys = !!normalizeKeys;
};

/**
 * Normalizes keys between the different configuration formats.
 *
 * Namely, you mostly have foo_bar in YAML while you have foo-bar in XML.
 * After running this method, all keys are normalized to foo_bar.
 *
 * If you have a mixed key like foo-bar_moo, it will not be altered.
 * The key will also not be altered if the target key already exists.
 *
 * @param {*} value
 *
 * @return {*}
 */
ArrayNode.prototype._preNormalize = function (value) {
    if (!this._normalizeKeys || !_.isPlainObject(value)) {
        return value;
    }

    for (var k in value) {
        if (!value.hasOwnProperty(k)) {
            continue;
        }
        var normalizedKey = k.replace(/-/g, '_');
        if ((k.indexOf('-') !== -1) && k.indexOf('_') === -1 && !value.hasOwnProperty(normalizedKey)) {
            value[normalizedKey] = value[k];
            delete value[k];
        }
    }

    return value;
};

/**
 * Retrieves the children of this node.
  *
  * @return {Object} The children
  */
ArrayNode.prototype.getChildren = function () {
    return this._children;
};

/**
 * Sets whether to add default values for this array if it has not been
 * defined in any of the configuration files.
 *
 * @param {boolean} bool
 */
ArrayNode.prototype.setAddIfNotSet = function (bool) {
    this._addIfNotSet = !!bool;
};

/**
 * Sets whether false is allowed as value indicating that the array should be unset.
 *
 * @param {boolean} allow
 */
ArrayNode.prototype.setAllowFalse = function (allow) {
    this._allowFalse = !!allow;
};

/**
 * Sets whether new keys can be defined in subsequent configurations
 *
 * @param {boolean} allow
 */
ArrayNode.prototype.setAllowNewKeys = function (allow) {
    this._allowNewKeys = !!allow;
};

/**
 * Sets if deep merging should occur.
 *
 * @param {boolean} perform
 */
ArrayNode.prototype.setPerformDeepMerging = function (perform) {
    this._performDeepMerging = !!perform;
};

/**
 * Whether extra keys should just be ignore without an error.
 *
 * @param {boolean} ignore
 */
ArrayNode.prototype.setIgnoreExtraKeys = function (ignore) {
    this._ignoreExtraKeys = !!ignore;
};

/**
 * Sets the node Name.
 *
 * @param {string} name
 */
ArrayNode.prototype.setName = function (name) {
    this._name = name;
};

/**
 * Checks if the node has a default value.
 *
 * @return {boolean}
 */
ArrayNode.prototype.hasDefaultValue = function () {
    return this._addIfNotSet;
};

/**
 * Retrieves the default value
 *
 * @return {Object} The default value
 */
ArrayNode.prototype.getDefaultValue = function () {
    if (!this.hasDefaultValue()) {
        throw new JSymfony.RuntimeError('The node at path "' + this.getPath() + '" has no default value.');
    }

    //todo: add native arrays
    var defaults = {};
    for (var name in this._children) {
        if (!this._children.hasOwnProperty(name)) {
            continue;
        }
        var child = this._children[name];
        if (child.hasDefaultValue()) {
            defaults[name] = child.getDefaultValue();
        }
    }

    return defaults;
};

/**
 * Adds a child node.
 *
 * @param {JSymfony.Config.Definition.NodeInterface} node
 */
ArrayNode.prototype.addChild = function (node) {
    var name = node.getName();
    if (!name) {
        throw new JSymfony.InvalidArgumentError('Child nodes must be names');
    }
    if (this._children.hasOwnProperty(name)) {
        throw new JSymfony.InvalidArgumentError('A child node named "' + name + '" already exists')
    }
    this._children[name] = node;
};

/**
 * Finalizes the value of this node.
 *
 * @param {*} value
 *
 * @return {*} The finalized value
 *
 * @protected
 */
ArrayNode.prototype._finalizeValue = function (value) {
    var msg, ex;
    if (false === value) {
        msg = fn.sprintf('Unsetting key for path "%s", value: %s', this.getPath(), JSON.stringify(value));
        throw new UnsetKeyError(msg);
    }

    for (var name in this._children) {
        if (!this._children.hasOwnProperty(name)) {
            continue;
        }

        var child = this._children[name];
        if (!value.hasOwnProperty(name)) {
            if (child.isRequired()) {
                msg = fn.sprintf('The child node "%s" at path "%s" must be configured.', name, this.getPath());
                ex = new InvalidConfigurationError(msg);
                ex.setPath(this.getPath());
                throw ex;
            }

            if (child.hasDefaultValue()) {
                value[name] = child.getDefaultValue();
            }
            continue;
        }

        try {
            value[name] = child.finalize(value[name]);
        } catch (e) {
            if (e instanceof UnsetKeyError) {
                delete value[name];
            } else {
                throw e;
            }
        }
    }

    return value;
};

/**
 * Validates the type of the value
 *
 * @param {*} value
 *
 * @protected
 */
ArrayNode.prototype._validateType = function (value) {
    if (!_.isArray(value) && !_.isPlainObject(value) && (!this._allowFalse || value !== false)) {
        var ex = new InvalidTypeError(fn.sprintf(
            'Invalid type for path "%s". Expected array, but got %s',
            this.getPath(),
            typeof value
        ));
        ex.setPath(this.getPath());
        throw ex;
    }
};

/**
 * Normalizes the value.
 *
 * @param {*} value
 *
 * @return {*} The normalized value
 *
 * @protected
 */
ArrayNode.prototype._normalizeValue = function (value) {
    if (value === false) {
        return value;
    }

    //todo: add plain array support
    var normalized = {};
    for (var name in this._children) {
        if (!this._children.hasOwnProperty(name)) {
            continue;
        }
        var child = this._children[name];

        if (value.hasOwnProperty(name)) {
            normalized[name] = child.normalize(value[name]);
            delete value[name];
        }
    }

    if (!_.isEmpty(value) && !this._ignoreExtraKeys) {
        var msg = fn.sprintf('Unrecognized options "%s" under "%s"', Object.keys(value).join(','), this.getPath());
        var ex = new InvalidConfigurationError(msg);
        ex.setPath(this.getPath());
        throw ex;
    }

    return normalized;
};

/**
 * Merges values together.
 * @param {*} leftSide
 * @param {*} rightSide
 *
 * @return {*}
 *
 * @protected
 */
ArrayNode.prototype._mergeValues = function (leftSide, rightSide) {
    if (false === rightSide) {
        // if this is still false after the last config has been merged the
        // finalization pass will take care of removing this key entirely
        return false;
    }

    if (false === leftSide || !this._performDeepMerging) {
        return rightSide;
    }

    for (var k in rightSide) {
        if (!rightSide.hasOwnProperty(k)) {
            continue;
        }
        var v = rightSide[k];

        if (!leftSide.hasOwnProperty(k)) {
            if (!this._allowNewKeys) {
                var ex = new InvalidConfigurationError(fn.sprintf(
                   'You are not allowed to define new elements for path "%s". ' +
                   'Please define all elements for this path in one config file. ' +
                   'If you are trying to overwrite an element, make sure you redefine it ' +
                   'with the same name.',
                    this.getPath()
                ));

                ex.setPath(this.getPath());

                throw ex;
            }
            leftSide[k] = v;
            continue;
        }

        if (!this._children.hasOwnProperty(k)) {
            throw new JSymfony.RuntimeError('merge() expects a normalized config array.')
        }

        leftSide[k] = this._children[k].merge(leftSide[k], v);
    }

    return leftSide;
};

JSymfony.Config.Definition.ArrayNode = module.exports = ArrayNode;
