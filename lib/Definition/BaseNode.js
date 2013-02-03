var DefinitionError = JSymfony.Config.Definition.Error.DefinitionError;
var ForbiddenOverwriteError = JSymfony.Config.Definition.Error.ForbiddenOverwriteError;
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;
var fn = JSymfony.fn;


/**
 * The base node class
 * @constructor
 * @abstract
 * @implements {JSymfony.Config.Definition.NodeInterface}
 *
 * @param {string?} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function BaseNode(name, parent) {
    if (typeof name === 'string' && name.indexOf('.') !== -1) {
        throw new JSymfony.InvalidArgumentError('The name must not contain "."');
    }

    this._name = name;
    this._parent = parent;
    this._normalizationClosures = [];
    this._finalValidationClosures = [];
    this._allowOverwrite = true;
    this._attributes = {};
    this._required = false;
    this._equivalentValues = [];
}

BaseNode.prototype.setAttribute = function (key, value) {
    this._attributes[key] = value;
};

BaseNode.prototype.getAttribute = function (key, defaultValue) {
    return this.hasAttribute(key) ? this._attributes[key] : defaultValue;
};

BaseNode.prototype.hasAttribute = function (key) {
    return this._attributes.hasOwnProperty(key);
};

BaseNode.prototype.getAttributes = function () {
    return this._attributes;
};

BaseNode.prototype.setAttributes = function (attributes) {
    this._attributes = attributes;
};

BaseNode.prototype.removeAttribute = function (key) {
    delete this._attributes[key];
};

/**
 * Sets an info message
 * @param {string} info
 */
BaseNode.prototype.setInfo = function (info) {
    this.setAttribute('info', info)
};

/**
 * Returns info message
 *
 * @return {string}
 */
BaseNode.prototype.getInfo = function () {
    return this.getAttribute('info');
};

/**
 * Sets an example configuration for this node
 * @param {string|Array} example
 */
BaseNode.prototype.setExample = function (example) {
    this.setAttribute('example', example)
};

/**
 * Retrieves the example configuration for this node.
 *
 * @return {string|Array}
 */
BaseNode.prototype.getInfo = function () {
    return this.getAttribute('example');
};

/**
 * Adds an equivalent value.
 *
 * @param {*} originalValue
 * @param {*} equivalentValue
 */
BaseNode.prototype.addEquivalentValue = function (originalValue, equivalentValue) {
    this._equivalentValues.push([originalValue, equivalentValue]);
};

BaseNode.prototype.setRequired = function (value) {
    this._required = !!value;
};

BaseNode.prototype.setAllowOverwrite = function (allow) {
    this._allowOverwrite = !!allow;
};

/**
 * Sets the closures used for normalization.
 *
 * @param {Array.<function>}closures
 */
BaseNode.prototype.setNormalizationClosures = function (closures) {
    this._normalizationClosures = closures;
};

/**
 * Sets the closures used for final validation.
 *
 * @param {Array.<function>}closures
 */
BaseNode.prototype.setFinalValidationClosures = function (closures) {
    this._finalValidationClosures = closures;
};

BaseNode.prototype.isRequired = function () {
    return this._required;
};

BaseNode.prototype.getName = function () {
    return this._name;
};

BaseNode.prototype.getPath = function () {
    var path = this._name;
    if (this._parent) {
        path = this._parent.getPath() + '.' + path;
    }
    return path;
};


/**
 * Merges two values together
 *
 * @param {*} leftSide
 * @param {*} rightSide
 *
 * @return {*}
 */
BaseNode.prototype.merge = function (leftSide, rightSide) {
    if (!this._allowOverwrite) {
        throw new ForbiddenOverwriteError(
            'Configuration path "' + this.getPath() + '" cannot be overwritten. You have to ' +
            'define all options for this path, and any of its sub-paths in ' +
            'one configuration section.'
        )
    }
    this._validateType(leftSide);
    this._validateType(rightSide);

    return this._mergeValues(leftSide, rightSide);
};

/**
 * Normalizes a value, applying all normalization closures.
 *
 * @param {*} value Value to normalize
 *
 * @return {*} The normalized value
 */
BaseNode.prototype.normalize = function (value) {
    value = this._preNormalize(value);

    // run custom normalization closures
    this._normalizationClosures.forEach(function (closure) {
        value =  fn.call(closure, value);
    });


    // replace value with their equivalent
    this._equivalentValues.forEach(function (data) {
        if (data[0] === value) {
            value = data[1];
        }
    });

    // validate type
    this._validateType(value);

    return this._normalizeValue(value);
};

/**
 * Normalizes the value before any other normalization is applied.
 * @param {*} value
 * @return {*}
 * @protected
 */
BaseNode.prototype._preNormalize = function (value) {
    return value;
};

/**
 * Finalizes a value, applying all finalization closures.
 *
 * @param {*} value The value to finalize
 *
 * @return {*} The finalized value
 */
BaseNode.prototype.finalize = function (value) {
    this._validateType(value);

    value = this._finalizeValue(value);

    var self = this;
    // Perform validation on the final value if a closure has been set.
    // The closure is also allowed to return another value
    this._finalValidationClosures.forEach(function (closure) {
        try {
            value = fn.call(value);
        } catch (e) {
            if (e instanceof DefinitionError) {
                throw e;
            }
            throw new InvalidConfigurationError(fn.sprintf(
                'Invalid configuration for path "%s": %s',
                self.getPath(),
                e.getMessage()
            ), e.code, e);
        }
    });

    return value;
};

/**
 * Validates the type of a Node.
 *
 * @param {*} value
 *
 * @protected
 * @abstract
 *
 * @throws {JSymfony.Config.Definition.Error.InvalidTypeError} when the value is invalid
 */
BaseNode.prototype._validateType = function (value) {
    throw new JSymfony.NotImplementedError(this, '_validateType');
};

/**
 * Normalizes the value.
 *
 * @protected
 * @abstract
 *
 * @param {*} value The value to normalize.
 *
 * @return {*} The normalized value
 */
BaseNode.prototype._normalizeValue = function (value) {
    throw new JSymfony.NotImplementedError(this, '_normalizeValue');
};

/**
 * Merges two values together.
 * @protected
 * @abstract
 *
 * @param {*} leftSide
 * @param {*} rightSide
 *
 * @return {*} The merged value
 */
BaseNode.prototype._mergeValues = function (leftSide, rightSide) {
    throw new JSymfony.NotImplementedError(this, '_mergeValues');
};

/**
 * Finalizes a value.
 * @protected
 * @abstract
 *
 * @param {*} value The value to finalize
 *
 * @return {*} The finalized value
 */
BaseNode.prototype._finalizeValue = function (value) {
    throw new JSymfony.NotImplementedError(this, '_finalizeValue');
};


JSymfony.Config.Definition.BaseNode = module.exports = BaseNode;
