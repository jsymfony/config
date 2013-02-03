var ArrayNode = JSymfony.Config.Definition.ArrayNode;
var util = require('util');
var fn = JSymfony.fn;
var _ = require('lodash');
var DefinitionError = JSymfony.Config.Definition.Error.DefinitionError;
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;
var InvalidTypeError = JSymfony.Config.Definition.Error.InvalidTypeError;
var UnsetKeyError = JSymfony.Config.Definition.Error.UnsetKeyError;
var DuplicateKeyError = JSymfony.Config.Definition.Error.DuplicateKeyError;

/**
 * Represents a prototyped Array node in the config tree
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.ArrayNode}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function PrototypedArrayNode(name, parent) {
    ArrayNode.call(this, name, parent);

    this._minNumberOfElements = 0;
    this._defaultValue = [];
    this._prototype = null;
    this._keyAttribute = null;
    this._removeKeyAttribute = null;
    this._defaultChildren = null;
}

util.inherits(PrototypedArrayNode, ArrayNode);

/**
 * Sets the minimum number of elements that a prototype based node must
 * contain. By default this is zero, meaning no elements.
 *
 * @param {numeric} number
 */
PrototypedArrayNode.prototype.setMinNumberOfElements = function (number) {
    this._minNumberOfElements = number;
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
 */
PrototypedArrayNode.prototype.setKeyAttribute = function (name, removeKeyItem) {
    this._keyAttribute = name;
    this._removeKeyAttribute = typeof removeKeyItem === 'undefined' || removeKeyItem;
};

/**
 * Retrieves the name of the attribute which value should be used as key
 *
 * @return {string} The name of the attribute
 */
PrototypedArrayNode.prototype.getKeyAttribute = function () {
    return this._keyAttribute;
};

/**
 * Sets the default value of this node
 *
 * @param {Array|Object} value
 */
PrototypedArrayNode.prototype.setDefaultValue = function (value) {
    if (!_.isArray(value) && !_.isPlainObject(value)) {
        throw new JSymfony.InvalidArgumentError(this.getPath() + ': the default value of an array node has to be an array or plain object');
    }
};

/**
 * Checks if the node has a default value.
 *
 * @return {boolean}
 */
PrototypedArrayNode.prototype.hasDefaultValue = function () {
    return true;
};

/**
 * Adds default children when none are set
 *
 * @param {numeric|string|Array|null} children The number of children|The child name|The children names to be added
 */
PrototypedArrayNode.prototype.setAddChildrenIfNoneSet = function (children) {
    if (typeof children === 'undefined' || children === null) {
        this._defaultChildren = ['defaults'];
    } else {
        if (fn.isInteger(children) && children > 0) {
            this._defaultChildren = [];
            for (var i = 0; i < children; i++) {
                this._defaultChildren.push(i);
            }
        } else {
            this._defaultChildren =  fn.castArray(children);
        }
    }
};

/**
 * Retrieves the default value.
 *
 * The default value could be either explicited or derived from the prototype
 * default value.
 *
 * @return {Array|Object} The default value
 */
PrototypedArrayNode.prototype.getDefaultValue = function () {
    if (null !== this._defaultChildren) {

        var defaultValue = this._prototype.hasDefaultValue() ? this._prototype.getDefaultValue() : [];

        var defaults = [];
        if (null !== this._keyAttribute && !fn.isInteger(this._keyAttribute)) {
            defaults = {};
        }

        var i = 0;
        for (var key in this._defaultChildren) {
            if (!this._defaultChildren.hasOwnProperty(key)) {
                continue;
            }

            var name = this._defaultChildren[key];
            defaults[null === this._keyAttribute ? i : name] = defaultValue;
            i++;
        }
        return defaults;
    }


    return this._defaultValue;
};

/**
 * Sets the node prototype
 *
 * @param {JSymfony.Config.Definition.PrototypeNodeInterface} node
 */
PrototypedArrayNode.prototype.setPrototype = function (node) {
    this._prototype = node;
};

/**
 * Retrieves the prototype
 *
 * @return {JSymfony.Config.Definition.PrototypeNodeInterface}
 */
PrototypedArrayNode.prototype.getPrototype = function () {
    return this._prototype;
};

/**
 * Disable adding concrete children for prototyped nodes.
 *
 * @param {JSymfony.Config.Definition.NodeInterface} node
 */
PrototypedArrayNode.prototype.addChild = function (node) {
    throw new DefinitionError('A prototyped array node can not have concrete children.');
};

/**
 * Finalizes the value of this node.
 *
 * @param {*} value
 *
 * @return {*}
 */
PrototypedArrayNode.prototype._finalizeValue = function (value) {
    if (false === value) {
        throw new UnsetKeyError(fn.sprintf(
            'Unsetting key for path "%s", value: %s',
            this.getPath(),
            JSON.stringify(value)
        ));
    }

    for (var k in value) {
        if (!value.hasOwnProperty(k)) {
            continue;
        }
        var v = value[k];
        this._prototype.setName(k);
        try {
            value[k] = this._prototype.finalize(v);
        } catch (e) {
            if (!e instanceof UnsetKeyError) {
                throw e;
            }
            delete value[k];
        }
    }

    if (Object.keys(value).length < this._minNumberOfElements) {
        var msg = fn.sprintf('The path "%s" should have at least %d element(s) defined.', this.getPath(), this._minNumberOfElements);
        var ex = new InvalidConfigurationError(msg);
        ex.setPath(this.getPath());

        throw ex;
    }

    return value;
};

/**
 * Normalizes the value.
 *
 * @param {*} value
 *
 * @return {*}
 */
PrototypedArrayNode.prototype._normalizeValue = function (value) {
    if (false === value) {
        return value;
    }
    var msg;
    var isAssoc = !_.isArray(value);
    var normalized = isAssoc ? {} : [];
    for (var k in value) {
        if (!value.hasOwnProperty(k)) {
            continue;
        }
        var v = value[k];
        if (null != this._keyAttribute && (_.isPlainObject(v) || _.isArray(v))) {
            if (!isAssoc && !v.hasOwnProperty(this._keyAttribute)) {
                msg = fn.sprintf('The attribute "%s" must be set for path "%s".', this._keyAttribute, this.getPath());
                var ex = new InvalidConfigurationError(msg);
                ex.setPath(this.getPath());

                throw ex;
            } else if (v.hasOwnProperty(this._keyAttribute)) {
                k = v[this._keyAttribute];

                if (this._removeKeyAttribute) {
                    delete v[this._keyAttribute];
                }

                // if only "value" if left
                if (1 === Object.keys(v).length && v.hasOwnProperty('value')) {
                    v = v.value;
                }
            }

            if (normalized.hasOwnProperty(k)) {
                msg = fn.sprintf('Duplicate key "%s" for path "%s".', k, this.getPath());
                ex = new DuplicateKeyError(msg);
                ex.setPath(this.getPath());
                throw  ex;
            }
        }

        this._prototype.setName(k);
        if (null !== this._keyAttribute || isAssoc) {
            normalized[k] = this._prototype.normalize(v);
        } else {
            normalized.push(this._prototype.normalize(v));
        }
    }

    return normalized;
};

/**
 * Merges values together
 *
 * @param {*} leftSide
 * @param {*} rightSide
 * @protected
 */
PrototypedArrayNode.prototype._mergeValues = function (leftSide, rightSide) {
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
        // prototype, and key is irrelevant, so simply append the element
        if (null === this._keyAttribute) {
            leftSide.push(v); //fixMe: проверить что тут массив а не объект
            continue;
        }

        if (!leftSide.hasOwnProperty(k)) {
            if (!this._allowNewKeys) {
                var ex = new InvalidConfigurationError(fn.sprintf(
                    'You are not allowed to define new elements for path "%s". ' +
                    'Please define all elements for this path in one config file.',
                    this.getPath()
                ));
                ex.setPath(this.getPath());

                throw ex;
            }

            leftSide[k] = v;
            continue;
        }

        this._prototype.setName(k);
        leftSide[k] = this._prototype.merge(leftSide[k], v);
    }

    return leftSide;
};


JSymfony.Config.Definition.PrototypedArrayNode = module.exports = PrototypedArrayNode;
