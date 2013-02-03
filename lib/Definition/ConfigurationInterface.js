/**
 * Configuration interface
 *
 * @interface
 */
function ConfigurationInterface() {

}

/**
 * Generates the configuration tree builder.
 *
 * @return {JSymfony.Config.Definition.Builder.TreeBuilder} The tree builder
 */
ConfigurationInterface.prototype.getConfigTreeBuilder = function () {};

JSymfony.Config.Definition.ConfigurationInterface = module.exports = ConfigurationInterface;
