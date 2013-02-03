var fn = JSymfony.fn;
/**
 * This class is the entry point for config normalization/merging/finalization.
 *
 * @constructor
 */
function Processor() {

}

/**
 * Processes an array of configurations.
 *
 * @param {JSymfony.Config.Definition.NodeInterface} configTree The node tree describing the configuration
 * @param {Array} configs    An array of configuration items to process
 *
 * @return {Array} The processed configuration
 */
Processor.prototype.process = function (configTree, configs) {
    configs = fn.castArray(configs);

    var currentConfig = {};
    configs.forEach(function (config) {
        var normalizedConfig = configTree.normalize(config);
        currentConfig = configTree.merge(currentConfig, normalizedConfig);
    });

    return configTree.finalize(currentConfig);
};

/**
 * Processes an array of configurations.
 *
 * @param {JSymfony.Config.Definition.ConfigurationInterface} configuration
 * @param {Array} configs An array of configuration items to process
 *
 * @return {Object} The processed configuration
 */
Processor.prototype.processConfiguration = function (configuration, configs) {
    return this.process(configuration.getConfigTreeBuilder().buildTree(), configs)
};


JSymfony.Config.Definition.Processor = module.exports = Processor;
