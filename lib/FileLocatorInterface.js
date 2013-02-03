/**
 * @interface
 */
function FileLocatorInterface() {

}

/**
 * Returns an array of full path for a given file name
 *
 * @param {string} name
 * @param {string} currentPath
 *
 * @return Array.<string>
 */
FileLocatorInterface.prototype.locateAll = function (name, currentPath) {};

/**
 * Return first matched full path for a given file name
 *
 * @param {string} name
 * @param {string} currentPath
 *
 * @return {string}
 */
FileLocatorInterface.prototype.locate = function (name, currentPath) {};

JSymfony.Config.FileLocatorInterface = module.exports = FileLocatorInterface;
