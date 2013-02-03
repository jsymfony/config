var util = require('util');
var parent = JSymfony.Config.Error.FileLoaderLoadError;

function FileLoaderImportCircularReferenceError(resources, code, previous) {
    var self = this;
    var path = resources.map(function(resource) {
        self.varToString(resource);
    }).join('" > "');

    JSymfony.fn.sprintf('Circular reference detected for parameter "%s" ("%s" > "%s").', self.varToString(resources[0]), path, self.varToString(resources[0]))

    parent.call(this, message, code, previous)
}

util.inherits(FileLoaderImportCircularReferenceError, parent);

FileLoaderImportCircularReferenceError.prototype.name = 'FileLoaderImportCircularReferenceError';

JSymfony.Config.FileLoaderImportCircularReferenceError = module.exports = FileLoaderImportCircularReferenceError;


