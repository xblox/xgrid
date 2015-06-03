/** @module xgrid/ThumbRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'dojo/dom-construct',
    './Renderer',
    'dgrid/Tree'
], function (declare,types,domConstruct,Renderer,Tree) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {};

    //package via declare
    var _class = declare('xgrid.TreeRenderer',[Renderer,Tree],Implementation);
    _class.Implementation = Implementation;

    return _class;
});