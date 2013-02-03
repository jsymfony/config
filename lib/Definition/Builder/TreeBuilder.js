function TreeBuilder() {
    this._tree = null;
    this._root = null;
}

TreeBuilder.prototype.root = function (name, type, builder) {
    type = type || 'array';
    builder = builder || new JSymfony.Config.Definition.Builder.NodeBuilder();
    return this._root =  builder.node(name, type).setParent(this);
};

TreeBuilder.prototype.buildTree = function () {
    if (!this._root) {
        throw new JSymfony.RuntimeError('The configuration tree has no root node.');
    }

    if (this._tree) {
        return this._tree;
    }

    this._tree = this._root.getNode(true);

    return this._tree;
};

JSymfony.Config.Definition.Builder.TreeBuilder = module.exports = TreeBuilder;
