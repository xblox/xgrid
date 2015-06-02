/** @module xgrid/ListRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    './Renderer'
], function (declare,types,Renderer) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ListRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {};

    //package via declare
    var _class = declare('xgrid.Renderer',[Renderer],Implementation);
    _class.Implementation = Implementation;

    return _class;
});