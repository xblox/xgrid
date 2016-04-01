/** @module xgrid/ThumbRenderer **/
define([
    "xdojo/declare",
    './Renderer',
    'dgrid/Tree',
    "dojo/keys",
    "xide/utils",
    "dojo/on"
], function (declare,Renderer,Tree,keys,utils,on) {

    var _debug = false;
    /**
     * The list renderer does nothing since the xgrid/Base is already inherited from
     * dgrid/OnDemandList and its rendering as list already.
     *
     * @class module:xgrid/ThumbRenderer
     * @extends module:xgrid/Renderer
     */

    var Implementation = {
        _getLabel:function(){ return "Tree"; },
        _getIcon:function(){ return "fa-tree"; },
        activateRenderer:function(renderer){
            this._showHeader(true);
        },
        __getParent:function(item){
            if(item && item.getParent){
                var _parent = item.getParent();
                if(_parent){
                    var row = this.row(_parent);
                    if(row.element){
                        return this.__getParent(_parent);
                    }else{
                        return _parent || item;
                    }
                }
            }
            return item;
        },
        getCurrentFolder:function(){
            var firstRow = this.getRows()[0];
            return this.__getParent(firstRow);
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
            return !!this._expanded[this.row(item).id];
        },
        shouldHandleKey: function (key) {
            return !(key == 39 || key == 37);
        },
        onTreeKey:function(evt){
            this.inherited(arguments);
        },
        startup:function(){
            if(this._started){
                return;
            }
            this.inherited(arguments);
            var thiz = this;


            this.on("keydown", function (evt) {
                this.onTreeKey(evt);
                if(thiz.isThumbGrid){
                    return;
                }
                if(evt.keyCode==keys.LEFT_ARROW ||evt.keyCode==keys.RIGHT_ARROW || evt.keyCode==keys.HOME || evt.keyCode==keys.END){
                }else{
                    return;
                }
                if((evt.originalTarget && evt.originalTarget.className.indexOf('InputInner') != -1)){
                    return;
                }
                if((evt.target && evt.target.className.indexOf('input') != -1)){
                    //return;
                }
                var row = this.row(evt);
                if(!row || !row.data){
                    return;
                }
                var data = row.data,
                    isExpanded = this._isExpanded(data),
                    store = this.collection,
                    storeItem = store.getSync(data[store.idProperty]);
                    //var children = data.getChildren ? data.getChildren() :  storeItem && storeItem.children ? null : store.children ? store.children(storeItem) : null;
                    var children = data.getChildren ? data.getChildren() :  storeItem && storeItem.children ? storeItem.children : null;
                    var isFolder = storeItem ? (storeItem.isDir || storeItem.directory) : false,
                    firstChild = children ? children[0] : false,
                    focused = this._focusedNode,
                    last = focused ? this.down(focused, children ? children.length : 0, true) :null,
                    loaded = ( storeItem._EX === true || storeItem._EX == null ),
                    selection = this.getSelection ? this.getSelection () : [storeItem],
                    next = null,
                    down = this.down(this._focusedNode, -1, true),
                    up = this.down(this._focusedNode, 1, true),
                    defaultSelectArgs = {
                        focus: true,
                        append: false,
                        delay: 1
                    };

                if(firstChild && firstChild._reference){
                    var _b = store.getSync(firstChild._reference);
                    if(_b){
                        firstChild = _b;
                    }
                }
                if(evt.keyCode==keys.END) {
                    if(isExpanded && isFolder && last && last.element !==focused){
                        this.select([last.data], null, true, defaultSelectArgs);
                        return;
                    }
                }

                function expand(what,expand){
                    _.each(what, function (item) {
                        thiz.expand(thiz.row(item), expand, true);
                    });
                }

                if(evt.keyCode==keys.LEFT_ARROW){

                    evt.preventDefault();
                    if (data[store.parentField]){
                        var item = row.data;
                        if (!isExpanded) {
                            var parent = store.getSync(item[store.parentField]);
                            var parentRow = parent ? this.row(parent) : null;
                            //we select the parent only if its rendered at all
                            if (parent && parentRow.element ) {
                                return this.select([parent], null, true, defaultSelectArgs);
                            }else{
                                if(down) {
                                    return this.select(down, null, true, defaultSelectArgs);
                                }else {
                                    on.emit(this.contentNode, "keydown", {keyCode: 36, force: true});
                                }
                            }
                        }
                    }
                    if (row) {
                        if(isExpanded) {
                            expand(selection,false);
                        }else{
                            this.select(down, null, true, defaultSelectArgs);
                        }
                    }
                }

                if(evt.keyCode==keys.RIGHT_ARROW){
                    evt.preventDefault();
                    // empty folder:
                    if(isFolder && loaded && isExpanded && !firstChild){
                        //go to next
                        if(up) {
                            return this.select(up, null, true, defaultSelectArgs);
                        }
                    }

                    if(loaded && isExpanded){
                        if(firstChild) {
                            return this.select([firstChild], null, true, defaultSelectArgs);
                        }
                    }else{
                        //has children or not loaded yet
                        if(firstChild || !loaded || isFolder) {
                            expand(selection,true);
                        }else{
                            //case on an cell without no children: select do
                            next = this.down(this._focusedNode, 1, true);
                            if(next) {
                                return this.select(next, null, true, defaultSelectArgs);
                            }
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