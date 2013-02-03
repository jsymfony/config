/**
 * This class builds merge conditions.
 *
 * @constructor
 * @param {JSymfony.Config.Definition.Builder.NodeDefinition} node
 */
function MergeBuilder(node) {
    this._node = node;
    this._allowFalse = false;
    this._allowOverwrite = true;
}

/**
 * Sets whether the node can be unset
 *
 * @param {boolean?} allow
 *
 * @return {MergeBuilder}
 */
MergeBuilder.prototype.allowUnset = function (allow) {
    this._allowFalse = allow || typeof allow === 'undefined';
    return this;
};

/**
 * Sets whether the node can be overwritten
 *
 * @param {boolean} deny
 *
 * @return {MergeBuilder}
 */
MergeBuilder.prototype.denyOverwrite = function (deny) {
    this._allowOverwrite = !deny;
    return this;
};

/**
 * Returns the related node.
 * @return {JSymfony.Config.Definition.Builder.NodeDefinition}
 */
MergeBuilder.prototype.end = function () {
    return this._node;
};

MergeBuilder.prototype.getAllowOverwrite = function () {
    return this._allowOverwrite;
};

MergeBuilder.prototype.getAllowFalse = function () {
    return this._allowFalse;
};

JSymfony.Config.Definition.Builder.MergeBuilder = module.exports = MergeBuilder;
