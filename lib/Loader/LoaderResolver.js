/**
 * LoaderResolver selects a loader for a given resource
 * Each loader determines whether it can load a resource and how
 *
 * @param {Array.<JSymfony.Config.Loader.LoaderInterface>} loaders
 * @constructor
 * @implements {JSymfony.Config.Loader.LoaderResolverInterface}
 */
function LoaderResolver(loaders) {
    this._loaders = [];

    var self = this;
    if (loaders) {
        loaders.forEach(function (loader) {
            self.addLoader(loader);
        });
    }
}

/**
 * Returns a loader able to load the resource.
 *
 * @param {*} resource
 * @param {string} type
 *
 * @return {JSymfony.Config.Loader.LoaderInterface?}
 */
LoaderResolver.prototype.resolve = function (resource, type) {
    for (var i = 0; i < this._loaders.length; i++) {
        var loader = this._loaders[i];
        if (loader.supports(resource, type)) {
            return loader;
        }
    }
    return null;
};

/**
 * Adds a loader
 *
 * @param {JSymfony.Config.Loader.LoaderInterface} loader
 */
LoaderResolver.prototype.addLoader = function (loader) {
    this._loaders.push(loader);
    loader.setResolver(this);
};

/**
 * Returns the registered loaders.
 * @return {Array.<JSymfony.Config.Loader.LoaderInterface>}
 */
LoaderResolver.prototype.getLoaders = function () {
    return this._loaders;
};


JSymfony.Config.Loader.LoaderResolver = module.exports = LoaderResolver;
