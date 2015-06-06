/** @module xgrid/ThumbRenderer **/
define([
    "xdojo/declare",
    './Renderer',
    'dgrid/Tree',
    "dojo/keys",
    "xide/utils"
], function (declare,Renderer,Tree,keys,utils) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */

    var Implementation = {
        _getLabel:function(){ return "Tree"; },
        _getIcon:function(){ return "fa-cube"; },
        activateRenderer:function(renderer){},
        deactivateRenderer:function(renderer){},
        _toFocusNode: function (item) {
            var row = this.row(item);
            if (row && row.element) {
                var innerNode = utils.find('.dgrid-cell', row.element, true);
                if (innerNode) {
                    return innerNode;
                } else {
                    return row.element;
                }
            } else {
                var innerNode = utils.find('.dgrid-row', this.domNode, true);
                if (innerNode) {
                    return innerNode;
                }
            }
            return null;
        },
        _isExpanded: function (item) {

            var focusNode = this.toFocusNode(item);
            if (focusNode) {
                var innerNode = utils.find('.ui-icon-triangle-1-se', focusNode, true);
                if (innerNode) {
                    return true;
                } else {
                    innerNode = utils.find('.ui-icon-triangle-1-e', focusNode, true);
                    if (!innerNode) {
                        return null;
                    }
                }
            }
            return false;

        },
        shouldHandleKey: function (key) {
            return !(key == 39 || key == 37);
        },
        startup:function(){
            if(this._started){
                return;
            }
            this.inherited(arguments);

            this.on("keydown", function (evt) {

                if((evt.originalTarget && evt.originalTarget.className.indexOf('InputInner') != -1)){
                    return;
                }

                if(evt.keyCode==keys.LEFT_ARROW){

                    evt.preventDefault();

                    var row = this.row(evt);

                    if (row && row.data && row.data[this.parentField]) {
                        var item = row.data;
                        var isExpanded = this._isExpanded(row.data);
                        if (!isExpanded) {
                            var store = this.collection;
                            var parent = store.getSync(item[store.parentField]);
                            if (parent) {
                                this.select(parent, true);
                                return;
                            }
                        }
                    }
                    if (row && this.expand) {
                        this.expand(row,null,false);
                    }
                }
                if(evt.keyCode==keys.RIGHT_ARROW){
                    evt.preventDefault();

                    var row = this.row(evt);
                    if (row && this.expand) {
                        this.expand(row,true,true);
                    }
                }
            }.bind(this));

        }
    };

    //package via declare
    var _class = declare('xgrid.TreeRenderer',[Renderer,Tree],Implementation);
    _class.Implementation = Implementation;

    return _class;
});