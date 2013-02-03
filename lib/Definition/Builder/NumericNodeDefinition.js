var util = require('util');

var ScalarNodeDefinition = JSymfony.Config.Definition.Builder.ScalarNodeDefinition;
var NumericNode = JSymfony.Config.Definition.NumericNode;
var InvalidArgumentError = JSymfony.InvalidArgumentError;
var fn = JSymfony.fn;

/**
 * Abstract class that contain common code of integer and float node definition
 *
 * @constructor
 * @abstract
 * @extends {JSymfony.Config.Definition.Builder.ScalarNodeDefinition}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.Builder.NodeParentInterface} parent
 */
function NumericNodeDefinition(name, parent) {
    ScalarNodeDefinition.call(this, name, parent);
    this._max = null;
    this._min = null;
}

util.inherits(NumericNodeDefinition, ScalarNodeDefinition);

/**
 * Ensures that the value is smaller than the given reference.
 *
 * @param {numeric} max
 *
 * @return {NumericNodeDefinition}
 */
NumericNodeDefinition.prototype.max = function (max) {
    if (this._min !== null && this._min > max) {
        throw new InvalidArgumentError(fn.sprintf('You cannot define a max(%s) as you already have a min(%s)', max, this._min));
    }
    this._max = max;

    return this;
};

/**
 * Ensures that the value is bigger than the given reference.
 *
 * @param {numeric} min
 *
 * @return {NumericNodeDefinition}
 */
NumericNodeDefinition.prototype.min = function (min) {
    if (this._max !== null && this._max < min) {
        throw new InvalidArgumentError(fn.sprintf('You cannot define a min(%s) as you already have a max(%s)', min, this._max));
    }
    this._min = min;
    return this;
};

JSymfony.Config.Definition.Builder.NumericNodeDefinition = module.exports = NumericNodeDefinition;
