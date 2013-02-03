/**
 * Common Interface among all nodes.
 *
 * In most cases, it is better to inherit from BaseNode instead of implementing
 * this interface yourself
 *
 * @interface
 */
function NodeInterface() {

}

/**
 * Returns the name of the node
 *
 * @return {string}
 */
NodeInterface.prototype.getName = function () {};

/**
 * Returns the path of the node
 *
 * @return {string}
 */
NodeInterface.prototype.getPath = function () {};

/**
 * Returns true when node is required
 *
 * @return {boolean}
 */
NodeInterface.prototype.isRequired = function () {};

/**
 * Returns true when the node has a default value
 *
 * @return {boolean}
 */
NodeInterface.prototype.hasDefaultValue = function () {};

/**
 * Returns the default value of the node
 *
 * @return {*}
 */
NodeInterface.prototype.getDefaultValue = function () {};

/**
 *  Normalizes the supplied value
 *
 *  @param {*} value
 *
 *  @return {*}
 */
NodeInterface.prototype.normalize = function (value) {};

/**
 * Merges two values togethes
 *
 * @param {*} leftSide
 * @param {*} rightSide
 *
 * @return {*}
 */
NodeInterface.prototype.merge = function (leftSide, rightSide) {};

/**
 * Finalizes a value
 *
 * @param {*} value
 *
 * @return {*}
 */
NodeInterface.prototype.finalize = function (value) {};

JSymfony.Config.Definition.NodeInterface = module.exports = NodeInterface;
