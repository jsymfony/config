/**
 * Loader is the abstract class used by all built-in loaders.
 *
 * @abstract
 * @implements {JSymfony.Config.Loader.LoaderInterface}
 */
function Loader() {

}

/**
 * @type {JSymfony.Config.Loader.LoaderResolverInterface}
 * @protected
 */
Loader.prototype._resolver = null;

/**
 * Gets the loader resolver
 *
 * @return {JSymfony.Config.Loader.LoaderResolverInterface}
 */
Loader.prototype.getResolver = function () {
    return this._resolver;
};

/**
 * Sets the loader resolver
 *
 * @param {JSymfony.Config.Loader.LoaderResolverInterface} resolver
 */
Loader.prototype.setResolver = function (resolver) {
    this._resolver = resolver;
};

/**
 * Imports a resource
 *
 * @param resource
 * @param type
 */
Loader.prototype.imports = function (resource, type) {
    this.resolve(resource).load(resource, type);
};

/**
 * Finds a loader able to load an imported resource.
 *
 * @param {*} resource
 * @param {string} type
 *
 * @return {JSymfony.Config.Loader.LoaderInterface}
 */
Loader.prototype.resolve = function (resource, type) {
    if (this.supports(resource, type)) {
        return this;
    }

    var loader;
    if (this._resolver) {
        loader = this._resolver.resolve(resource, type);
    }

    if (!loader) {
        throw new JSymfony.Config.Error.FileLoaderLoadError(resource);
    }

    return loader;
};



JSymfony.Config.Loader.Loader = module.exports = Loader;
