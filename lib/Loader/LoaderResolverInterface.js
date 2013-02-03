/**
 * LoaderResolverInterface selects a loader for a given resource.
 *
 * @interface
 */
function LoaderResolverInterface() {

}

/**
 * Returns a loader able to load the resource.
 *
 * @param {*}  resource
 * @param {string} type
 *
 * @return {JSymfony.Config.Loader.LoaderInterface} A LoaderInterface instance
 */

LoaderResolverInterface.prototype.resolve = function (resource, type) {};

JSymfony.Config.Loader.LoaderResolverInterface = module.exports = LoaderResolverInterface;
