var _ = require('lodash');
var fn = JSymfony.fn;

/**
 * This class builds an if expression
 *
 * @constructor
 * @param {JSymfony.Config.Definition.Builder.NodeDefinition} node
 */
function ExprBuilder(node) {
    this._node = node;
    this.ifPart = null;
    this.thenPart = null;
}

/**
 * Marks the expression as being always used.
 *
 * @param {function=} then
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.always = function (then) {
    this.ifPart = function () {
        return true;
    };
    if (then) {
        this.thenPart = then;
    }
    return this;
};

/**
 * Sets a closure to use as tests
 *
 * The default one tests if the value is true
 *
 * @param {function=} closure
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifTrue = function (closure) {
    if (!closure) {
        closure = function (v) {
            return v === true;
        }
    }

    this.ifPart = closure;

    return this;
};

/**
 * Tests if the value is a string.
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifString = function () {
    this.ifPart = function (v) {
        return typeof v === 'string';
    };

    return this;
};

/**
 * Tests if the value is null
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifNull = function () {
    this.ifPart = function (v) {
        return v === null;
    };

    return this;
};

/**
 * Tests if the value is an array.
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifArray = function () {
    this.ifPart = function (v) {
        return _.isArray(v) || _.isPlainObject(v)
    };

    return this;
};

/**
 * Tests if the value is an array.
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifObject = function () {
    this.ifPart = function (v) {
        return _.isPlainObject(v)
    };

    return this;
};

/**
 * Tests if the value is in an array
 *
 * @param {Array} array
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifInArray = function (array) {
    this.ifPart = function (v) {
        return array.indexOf(v) !== -1;
    };

    return this;
};

/**
 * Tests if the value is not in an array
 *
 * @param {Array} array
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.ifNotInArray = function (array) {
    this.ifPart = function (v) {
        return array.indexOf(v) === -1;
    };

    return this;
};

/**
 * Sets the closure to run if the test pass.
 *
 * @param {function} closure
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.then = function (closure) {
    this.thenPart = closure;

    return this;
};

/**
 * Sets a closure returning an empty array
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.thenEmptyArray = function () {
    this.thenPart = function () {
        return [];
    };

    return this;
};

/**
 * Sets a closure returning an empty object
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.thenEmptyObject = function () {
    this.thenPart = function () {
        return {};
    };

    return this;
};

/**
 * Sets a closure marking the value as invalid at validation time
 *
 * if you want to add the value of the node in your message just use a %s placeholder.
 *
 * @param {string} message
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.thenInvalid = function (message) {
    this.thenPart = function (v) {
        throw new JSymfony.InvalidArgumentError(fn.sprintf(message, JSON.stringify(v)));
    };

    return this;
};

/**
 * Sets a closure unsetting this key of the array at validation time.
 *
 * @return {ExprBuilder}
 */
ExprBuilder.prototype.thenUnset = function () {
    this.thenPart = function () {
        throw new JSymfony.InvalidArgumentError('Unsetting key');
    };

    return this;
};

/**
 * Returns the related node
 *
 * @return {JSymfony.Config.Definition.Builder.NodeDefinition}
 */
ExprBuilder.prototype.end = function () {
    if (!this.ifPart) {
        throw new JSymfony.RuntimeError('You must specify an if part');
    }
    if (!this.thenPart) {
        throw new JSymfony.RuntimeError('You must specify a then part');
    }

    return this._node;
};

/**
 * Builds the expressions.
 *
 * @param {Array.<ExprBuilder>} expressions An array of ExprBuilder instances to build
 *
 * @return {Array}
 */
ExprBuilder.buildExpressions = function (expressions) {
    var result = [];
    expressions.forEach(function (expr) {
        if (expr instanceof ExprBuilder) {
            result.push(function (v) {

                return fn.call(expr.ifPart, v) ? fn.call(expr.thenPart, v) : v;
            });
        } else {
            result.push(expr);
        }
    });

    return result;
};

JSymfony.Config.Definition.Builder.ExprBuilder = module.exports = ExprBuilder;
