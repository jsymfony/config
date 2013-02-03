var ExprBuilder = JSymfony.Config.Definition.Builder.ExprBuilder;

/**
 * This class builds normalization conditions
 *
 * @constructor
 *
 * @param {JSymfony.Config.Definition.Builder.NodeDefinition} node The related node
 */
function NormalizationBuilder(node) {
    this._node = node;
    this.keys = false;
    this._beforeClosures = [];
    this._remappings = [];
}

/**
 * Registers a key to remap to its plural form.
 *
 * @param {string} key    The key to remap
 * @param {string} plural The plural of the key in case of irregular plural
 *
 * @return {NormalizationBuilder}
 */
NormalizationBuilder.prototype.remap = function (key, plural) {
    this._remappings.push([key, typeof plural === 'undefined' ? key + 's' : plural]);
    return this;
};

/**
 * Registers a closure to run before the normalization or an expression builder to build it if null is provided
 *
 * @param {function} closure
 *
 * @return {ExprBuilder|NormalizationBuilder}
 */
NormalizationBuilder.prototype.before = function (closure) {
    if (closure) {
        this._beforeClosures.push(closure);
        return this;
    }

    closure = new ExprBuilder(this._node);
    this._beforeClosures.push(closure);
    return closure;
};

NormalizationBuilder.prototype.setBeforeClosures = function (closures) {
    this._beforeClosures = closures;
};

NormalizationBuilder.prototype.getBeforeClosures = function () {
    return this._beforeClosures;
};


JSymfony.Config.Definition.Builder.NormalizationBuilder = module.exports = NormalizationBuilder;
