/** @module xgrid/MultiRenderer **/
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
        renderers:null,
        selectedRender:null,
        renderRow:function(){
            var parent = this.selectedRender.prototype;
            if(parent['renderRow']) {
                return parent['renderRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        },
        insertRow:function(){

            var parent = this.selectedRender.prototype;
            if(parent['insertRow']) {
                return parent['insertRow'].apply(this, arguments);
            }
            return this.inherited(arguments);
        }

    };

    //package via declare
    var _class = declare('xgrid.MultiRenderer',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});