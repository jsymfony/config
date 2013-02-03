/**
 * @interface
 * @extends {JSymfony.Config.Definition.NodeInterface}
 */
function PrototypeNodeInterface() {

}

/**
 * Sets the name of the node.
 *
 * @param {string} name The name of the node
 */
PrototypeNodeInterface.prototype.setName = function (name) {};

JSymfony.Config.Definition.PrototypeNodeInterface = module.exports = PrototypeNodeInterface;
