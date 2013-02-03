var util = require('util');
var Loader = JSymfony.Config.Loader.Loader;

/**
 * @param {JSymfony.Config.Loader.LoaderResolverInterface} resolver
 * @extends {JSymfony.Config.Loader.Loader}
 *
 * @constructor
 */
function DelegatingLoader(resolver) {
    this._resolver = resolver;
}

util.inherits(DelegatingLoader, Loader);

/**
 * Loads a resource.
 *
 * @param {*} resource
 * @param {string} type
 *
 * @return {JSymfony.Config.Loader.LoaderInterface}
 */
DelegatingLoader.prototype.load = function (resource, type) {
    var loader = this._resolver.resolve(resource, type);
    if (!loader) {
        throw new JSymfony.Config.Error.FileLoaderLoadError(resource);
    }

    return loader.load(resource, type);
};

/**
 * @inheritDoc
 */
DelegatingLoader.prototype.supports = function (resource, type) {
    return this._resolver.resolve(resource, type);
};


JSymfony.Config.Loader.DelegatingLoader = module.exports = DelegatingLoader;
