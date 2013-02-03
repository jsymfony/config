var util = require('util');
var Loader = JSymfony.Config.Loader.Loader;
var FileLoaderLoadError = JSymfony.Config.Error.FileLoaderLoadError;

/**
 *
 * @param {JSymfony.Config.FileLocatorInterface} locator
 * @constructor
 * @extends {JSymfony.Config.Loader.Loader}
 */
function FileLoader(locator) {
    this._locator = locator;
    this._currentDir = '';
}


util.inherits(FileLoader, Loader);

/**
 * @type {JSymfony.Map}
 * @static
 * @protected
 */
FileLoader.prototype._$loading = new JSymfony.Map();

/**
 * @param {string} dir
 */
FileLoader.prototype.setCurrentDir = function (dir) {
    this._currentDir = dir;
};

/**
 * @return {JSymfony.Config.FileLocatorInterface}
 */
FileLoader.prototype.getLocator = function () {
    return this._locator;
};

/**
 * Imports a resource
 *
 * @param {string} resource
 * @param {string} type
 * @param {string} sourceResource
 *
 * @return {*}
 */
FileLoader.prototype.import = function (resource, type, sourceResource) {
    try {
        var loader = this.resolve(resource, type);

        if (loader instanceof FileLoader && null !== this._currentDir) {
            resource = this._locator.locate(resource, this._currentDir);
        }

        if (this._$loading.has(resource)) {
            throw new JSymfony.Config.Error.FileLoaderImportCircularReferenceError(this._$loading.keys());
        }

        this._$loading.set(resource, true);
        var ret = loader.load(resource, type);
        this._$loading.delete(resource);

        return ret;
    } catch (e) {
        if (e instanceof FileLoaderLoadError) {
            throw e;
        }
        throw new FileLoaderLoadError(resource, sourceResource, null, e);
    }
};

JSymfony.Config.Loader.FileLoader = module.exports = FileLoader;
