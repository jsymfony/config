/**
 * LoaderInterface is the interface implemented by all loader classes.
 *
 * @interface
 */
function LoaderInterface() {

}

/**
 * Loads a resource
 *
 * @param {*} resource
 * @param {string} type
 */
LoaderInterface.prototype.load = function (resource, type) {};

/**
 * Returns true if this class supports the given resource.
 *
 * @param {*} resource
 * @param {string} type
 */
LoaderInterface.prototype.supports = function (resource, type) {};

/**
 * Gets the loader resolver.
 */
LoaderInterface.prototype.getResolver = function () {};

/**
 * Sets the loader resolver.
 *
 * @param {JSymfony.Config.Loader.LoaderResolverInterface} resolver
 */
LoaderInterface.prototype.setResolver = function (resolver) {};

JSymfony.Config.Loader.LoaderInterface = module.exports = LoaderInterface;
