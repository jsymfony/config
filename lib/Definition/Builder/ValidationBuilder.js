var ExprBuilder = JSymfony.Config.Definition.Builder.ExprBuilder;

/**
 * This class builds validation conditions.
 *
 * @constructor
 * @param {JSymfony.Config.Definition.Builder.NodeDefinition} node The related node
 */
function ValidationBuilder(node) {
    this._node = node;
    this._rules = [];
}

/**
 * Registers a closure to run as normalization or an expression builder to build it if null is provided
 *
 * @param {function} closure
 *
 * @return {ExprBuilder|ValidationBuilder}
 */
ValidationBuilder.prototype.rule = function (closure) {
    if (closure) {
        this._rules.push(closure);
        return this;
    }
    var rule = new ExprBuilder(this._node);
    this._rules.push(rule);

    return rule;
};

ValidationBuilder.prototype.getRules = function () {
    return this._rules;
};

ValidationBuilder.prototype.setRules = function (rules) {
    this._rules = rules;
};

JSymfony.Config.Definition.Builder.ValidationBuilder = module.exports = ValidationBuilder;
