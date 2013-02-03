var util = require('util');
var parent = JSymfony.Error;

function FileLoaderLoadError(resource, sourceResource, code, previous) {
    var message;
    if (!sourceResource) {
        message = 'Cannot load resource "' + resource + '".';
    } else {
        message = 'Cannot import resource "' + this.varToString(resource) + '" from "' + this.varToString(sourceResource) + '".'
    }

    // Is the resource located inside a bundle?
    if (typeof resource === 'string' && resource[0] === '@') {
        var parts = resource.split('/');
        var bundle = parts[0].slice(1);
        message += ' Make sure the "' + bundle + '" bundle is correctly registered and loaded in the application kernel class'
    }

    parent.call(this, message, code, previous)
}

util.inherits(FileLoaderLoadError, parent);

FileLoaderLoadError.prototype.name = 'FileLoaderLoadError';

FileLoaderLoadError.prototype.varToString = function (variable) {
    return '' + variable;
};

JSymfony.Config.Error.FileLoaderLoadError = module.exports = FileLoaderLoadError;
