var BaseNode = JSymfony.Config.Definition.BaseNode;
var util = require('util');
var fn = JSymfony.fn;
var InvalidConfigurationError = JSymfony.Config.Definition.Error.InvalidConfigurationError;

/**
 * This node represents a value of variable type in the config tree.
 *
 * This node is intended for values of arbitrary type.
 * Any javascript type is accepted as a value
 *
 * @constructor
 * @extends {JSymfony.Config.Definition.BaseNode}
 * @implements {JSymfony.Config.Definition.PrototypeNodeInterface}
 *
 * @param {string} name
 * @param {JSymfony.Config.Definition.NodeInterface} parent
 */
function VariableNode(name, parent) {
    BaseNode.call(this, name, parent);
    this._defaultValueSet = false;
    this._defaultValue = null;
    this._allowEmptyValue = true;
}

util.inherits(VariableNode, BaseNode);


VariableNode.prototype.setDefaultValue = function (value) {
    this._defaultValueSet = true;
    this._defaultValue = value;
};

VariableNode.prototype.hasDefaultValue = function () {
    return this._defaultValueSet;
};

VariableNode.prototype.getDefaultValue = function () {
    if (typeof this._defaultValue === 'function') {
        return fn.call(this._defaultValue);
    }
    return this._defaultValue;
};

VariableNode.prototype.setAllowEmptyValue = function (allow) {
    this._allowEmptyValue = !!allow;
};

VariableNode.prototype.setName = function (name) {
    this._name = name;
};

VariableNode.prototype._validateType = function (value) {

};

VariableNode.prototype._finalizeValue = function (value) {
    if (!this._allowEmptyValue && !value) {
        var ex = new InvalidConfigurationError(fn.sprintf(
            'The path "%s" cannot contain an empty value, but got %s.',
            this.getPath(),
            JSON.stringify(value)
        ));

        ex.setPath(this.getPath());

        throw ex;
    }
    return value;
};

VariableNode.prototype._normalizeValue = function (value) {
    return value;
};

VariableNode.prototype._mergeValues = function (leftSide, rightSide) {
    return rightSide;
};


JSymfony.Config.Definition.VariableNode = module.exports = VariableNode;
