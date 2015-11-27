/** @module xgrid/ThumbRenderer **/
define([
    "xdojo/declare",
    './Renderer',
    'dgrid/Tree',
    "dojo/keys",
    "xide/utils",
    "dojo/on"
], function (declare,Renderer,Tree,keys,utils,on) {

    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */

    var Implementation = {
        _getLabel:function(){ return "Tree"; },
        _getIcon:function(){ return "el-icon-delicious"; },
        activateRenderer:function(renderer){
            this._showHeader(true);
        },
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

            var focusNode = this._toFocusNode(item);
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

            var thiz = this;

            this.on("keydown", function (evt) {

                if(thiz.isThumbGrid){
                    return;
                }

                //console.log('key down');
                /*
                if(this.selectedRendererClass!=='xgrid.TreeRenderer'){
                    return;
                }*/

                if((evt.originalTarget && evt.originalTarget.className.indexOf('InputInner') != -1)){
                    return;
                }
                var row = this.row(evt);
                if(!row || !row.data){
                    return;
                }

                var data = row.data,
                    isExpanded = this._isExpanded(data),
                    store = this.collection,
                    storeItem = store.getSync(data[store.idProperty]),
                    children = data.getChildren ? data.getChildren() :  storeItem.children,

                    firstChild = children ? children[0] : false,
                    loaded = ( storeItem._EX === true || storeItem._EX == null ),
                    defaultSelectArgs = {
                        focus: true,
                        append: false,
                        delay: 0
                    };

                if(evt.keyCode==keys.LEFT_ARROW){

                    evt.preventDefault();





                    if (data[store.parentField]){

                        var item = row.data;
                        if (!isExpanded) {

                            var parent = store.getSync(item[store.parentField]);
                            var parentRow = parent ? this.row(parent) : null;

                            //we select the parent only if its rendered at all

                            if (parent && parentRow.element ) {

                                if(parentRow.element) {
                                    this.select([parent], null, true, defaultSelectArgs);
                                }else{

                                }
                                return;
                            }else{
                                // no parent anymore,
                                /*
                                var e = $.Event("keydown");
                                e.which = 36; // # Some key code value
                                $(this.contentNode).trigger(e);
                                */

                                on.emit(this.contentNode, "keydown", {keyCode: 36});
                            }
                        }
                    }
                    if (row && this.expand) {
                        this.expand(row,null,false);
                    }
                }

                if(evt.keyCode==keys.RIGHT_ARROW){

                    evt.preventDefault();

                    if(loaded && isExpanded){
                        if(firstChild) {
                            this.select([firstChild], null, true, defaultSelectArgs);
                        }

                    }else{

                        //has children or not loaded yet
                        if(firstChild || !loaded) {
                            this.expand && this.expand(row,true,true);
                        }else{
                            //case on an cell without no children: select do
                            var _next = this.down(this._focusedNode, 1, true);
                            _next && this.select(_next,null,true,defaultSelectArgs);
                        }
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