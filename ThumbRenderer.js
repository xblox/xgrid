/** @module xgrid/ThumbRenderer **/
define([
    "xdojo/declare",
    'xide/types',
    'dojo/dom-construct',
    './Renderer'
], function (declare,types,domConstruct,Renderer) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */
    var Implementation = {
        isThumbGrid:false,
        _getLabel:function(){ return "Thumb"; },
        _getIcon:function(){ return "fa-th-large"; },
        activateRenderer:function(renderer){
            this._showHeader(false);
            this.isThumbGrid = true;
        },
        deactivateRenderer:function(renderer){
            this.isThumbGrid = false;
        },
        /**
         * Override renderRow
         * @param obj
         * @returns {*}
         */
        renderRow: function (obj) {
            if (obj.render) {
                return obj.render(obj, this.inherited);
            }
            return domConstruct.create('span', {
                className: "fileGridCell",
                innerHTML: '<span class=\"' + 'fa-cube fa-5x' + '\""></span> <div class="name">' + obj.name + '</div>',
                style: 'color:blue;max-width:200px;float:left;margin:18px;padding:18px;'
            });
        }
    };

    //package via declare
    var _class = declare('xgrid.ThumbRenderer',[Renderer],Implementation);
    _class.Implementation = Implementation;

    return _class;
});