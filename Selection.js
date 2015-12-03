/** @module xgrid/Selection **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dgrid/Selection',
    'dojo/dom-class',
    'dojo/on',
    'dojo/Deferred'
], function (declare,types,utils,Selection,domClass,on,Deferred) {

    function handledEvent(event) {
        // Text boxes and other inputs that can use direction keys should be ignored
        // and not affect cell/row navigation
        var target = event.target;
        return target.type && (event.keyCode === 32);
    }
    var _debug = false;
    /*
     *
     *
     *
     *
     * @class module xgrid/Selection
     *
     */
    var Implementation = {

        /**
         *
         * @param state
         * @returns {object}
         */
        getState:function(state) {

            state = this.inherited(arguments) || {};

            var selection = this._preserveSelection();

            var thisState = {
                selected:[]
            };


            if(selection.selection){
                _.each(selection.selection,function(item){
                   thisState.selected.push(item.path)
                });
            }

            if(selection.focused){
                thisState.focused = selection.focused.path;
            }

            state.selection = thisState;

            return state;
        },

        _lastSelection:null,
        _lastFocused:null,
        _refreshInProgress:null,
        /**
         * Mute any selection events.
         */
        _muteSelectionEvents:true,
        refresh:function(force){

            if(this._refreshInProgress){
                return this._refreshInProgress;
            }

            var _restore = this._preserveSelection(),
                thiz = this,
                active = this.isActive(),
                res = this.inherited(arguments);

            this._refreshInProgress = res;

            res.then(function(){

                thiz._refreshInProgress = null;
                thiz._restoreSelection(_restore);
                if(_restore.focused && (active || force )) {
                    //console.log('restore focused');
                    thiz.focus(thiz.row(_restore.focused));
                }
            });

            return res;
        },
        /**
         *
         */
        onShow:function(){

            this.select(this.getSelection(),null,true,{
                focus:true,
                delay:0
            });
            this.inherited(arguments);
        },

        /**
         * Normalize an item
         * @param what
         * @returns {*}
         * @private
         */
        _normalize:function(what){

            if(!what){
                return null;
            }

            if(!what.element){
                what = this.cell(what);
            }
            if(what && what.row){
                what=what.row;
            }
            return what;
        },
        /**
         * save deselect
         */
        deselectAll:function(){

            if(!this._lastSelection){
                return;
            }
            this.clearSelection();
            this._lastSelection=null;
            this._lastFocused=null;

            $(this.domNode).find('.dgrid-focus').each(function(i,el){
                $(el).removeClass('dgrid-focus');
            });

            this._emit('selectionChanged',{
                selection:[],
                why:"clear",
                source:'code'
            });

        },
        runAction:function(action){

            if(_.isString(action)){
                action = this.getActionStore().getSync(action);
            }

            if(action.command=='File/Select/None'){
                this.deselectAll();
                return true;
            }
            return this.inherited(arguments);
        },
        _preserveSelection:function(){
            this.__lastSelection = this.getSelection();
            this._lastFocused = this.getFocused();
            var result = {
                selection : this.getSelection(),
                focused : this.getFocused()
            };

            return result;
        },
        _restoreSelection:function(what){

            var lastFocused = what ? what.focused : this._lastFocused;
            var lastSelection = what ? what.selection : this.__lastSelection;

            if(_.isEmpty(lastSelection)){
                lastFocused=null;
                this._lastFocused=null;
            }else {
                //restore:
                this.select(lastSelection, null, true, {
                    silent: true,
                    append: false,
                    delay: 0
                });

                if (lastFocused && this.isActive()) {
                    this.focus(this.row(lastFocused));
                }
                //this._lastFocused = this.__lastSelection = null;
            }
        },
        /**
         * get previous item
         * @param from
         * @param domNode
         * @param skipSelected
         * @returns {*}
         */
        getPrevious:function(from,domNode,skipSelected){

            from = from || this.getFocused(domNode);
            from = this._normalize(from);

            var nextNode = this.cell(this._move(from, -1, "dgrid-row"));
            if(nextNode && nextNode.row){
                nextNode = nextNode.row[domNode? 'element' : 'data' ];
                if(skipSelected===true) {


                    if(this.isSelected(nextNode)){
                        //nothing previous here
                        if(from && from.data && from.data == nextNode){
                            return null;
                        }
                        var _nextNode = this.getPrevious(nextNode,domNode,skipSelected);
                        if(_nextNode){
                            return _nextNode;
                        }
                    }
                }
            }
            return nextNode;
        },
        /**
         * get next item
         * @param from
         * @param domNode
         * @param skipSelected
         * @returns {*}
         */
        getNext:function(from,domNode,skipSelected){

            from = from || this.getFocused(domNode);
            from = this._normalize(from);

            var nextNode = this.cell(this._move(from, 1, "dgrid-row"));
            if(nextNode && nextNode.row){
                nextNode = nextNode.row[domNode? 'element' : 'data' ];
                if(skipSelected===true) {
                    if(this.isSelected(nextNode)){

                        //nothing previous here
                        if(from && from.data && from.data == nextNode){
                            return null;
                        }
                        var _nextNode = this.getNext(nextNode,domNode,skipSelected);
                        if(_nextNode){
                            return _nextNode;
                        }
                    }
                }
            }
            return nextNode;
        },
        /**
         *
         * @param filterFunction
         * @returns selection {Object[] | NULL }
         */
        getSelection:function(filterFunction){

            var result = [];
            for (var id in this.selection) {
                var item = this.collection.getSync(id);
                item && result.push(item);
            }
            if(filterFunction){
                return result.filter(filterFunction);
            }
            return result;
        },
        /**
         *
         * @param filter
         * @returns {*}
         */
        getSelectedItem:function(filter){
            var _selection = this.getSelection(filter);
            if(_selection.length==1){
                return _selection[0];
            }
            return null;
        },
        /**
         * Override std::postCreate
         * @returns {*}
         */
        postCreate:function(){

            var thiz = this;
            if(this.options[types.GRID_OPTION.CLEAR_SELECTION_ON_CLICK]===true){

                var clickHandler = function(evt) {
                    if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                        this.deselectAll();                    }
                }.bind(this);


                this.on("click", function (evt) {
                    clickHandler(evt);
                }.bind(this));

                this.on("contextmenu", function (evt) {
                    clickHandler(evt);
                }.bind(this));

            }

            function rows(selection){
                var result = [];
                if(selection && selection.rows){
                    selection.rows.forEach(function(row){
                        result.push(row.id);
                    });
                }
                return result;
            }

            function allArraysAlike(arrays) {
                return _.all(arrays, function(array) {
                    return array.length == arrays[0].length && _.difference(array, arrays[0]).length == 0;
                });
            }

            function equals(lastSelection,newSelection){
                var cSelected = rows(lastSelection);
                var nSelected = rows(newSelection);
                return allArraysAlike([cSelected,nSelected]);
            }

            this.on("dgrid-select", function (data) {

                if(!equals(thiz._lastSelection,data)){

                    thiz._lastSelection=data;
                    thiz._emit('selectionChanged',{
                        selection:thiz.getSelection(),
                        why:"select",
                        source:data.parentType
                    });
                    //console.profileEnd('s');
                }else{
                    //console.log('same selection!');
                }


            });




            this.on("dgrid-deselect", function (data) {
                //thiz._lastSelection=null;
                /*
                thiz._emit('selectionChanged', {
                    selection: this.getSelection(),
                    why: "deselect"
                });*/
            }.bind(this));


            return this.inherited(arguments);
        },
        /**
         * Override dgrid/Selection::_fireSelectionEvents
         * @returns {*}
         * @private
         */
        _fireSelectionEvents:function(){
            if(this._muteSelectionEvents===true){
                return;
            }
            return this.inherited(arguments);
        },
        __select:function(items,toRow,select,dfd){

            _.each(items,function(item){
                if(item) {
                    var _row = this.row(item);
                    if(_row) {
                        this._select(_row, toRow, select);
                    }
                }
            },this);


            dfd && dfd.resolve(items);

            this._muteSelectionEvents=false;
            this._fireSelectionEvents();
        },
        /**
         * Overrides dgrid selection
         * @param mixed
         * @param toRow {object} preserve super
         * @param select {boolean} preserve super
         * @param options {object}
         * @param options.focus {boolean}
         * @param options.silent {boolean}
         * @param options.append {boolean}
         * @param options.expand {boolean}
         * returns dojo/Deferred
         */
        select:function(mixed,toRow,select,options,reason){

            var def  = new Deferred();

            reason = reason  || '';


            //sanitize/defaults
            options = options || {};

            //toRow = toRow || null;


            select = select == null ? true : select;

            var delay = options.delay || 0,
                self = this;


            //silence selection change (batch or state restoring job)
            if(options.silent===true){
                self._muteSelectionEvents=true;
            }

            //clear previous selection
            if(options.append===false){
                self.clearSelection();
                $(self.domNode).find('.dgrid-focus').each(function(i,el){
                    $(el).removeClass('dgrid-focus');
                });
            }

            //normalize to array
            var items = utils.isArray(mixed) ? mixed : [mixed];
            if(_.isEmpty(items)){
                return;
            }

            //indices to items
            if(_.isNumber(items[0])){

                var _newItems = [],
                    rows = self.getRows();

                _.each(items,function(item){
                    _newItems.push(rows[item]);
                });

                items = _newItems;

            }else if(_.isString(items[0])){

                var coll = this.collection;

                var _newItems = [];

                _.each(items,function(item) {
                    _newItems.push(coll.getSync(item));
                });

                items = _newItems;
            }

            if(!items.length){
                _debug && console.log('nothing to select!');
                def.resolve();
                return def;
            }
/*
            var _test = this.row(items[0]),
                test = null;
            if(_test){

                if(_test.data && _test.data.path==='./Tutorials/index.css'){
                    test = _test;
                }
            }
*/

            //focus
            if(options.focus===true){

                if(options.expand==null){
                    options.expand=true;
                }

                if(options.expand){

                    if(!self.isRendered(items[0])||items[0].__dirty){
                        self._expandTo(items[0]);
                    }
                }
                //self._focusedNode = null;
                var _next = self.row(items[0]);
                if(_next && _next.element) {
                    //self._focusedNode = _next.element;
                    //items.length && self.focus(items[0],false);
                    //self.domNode.focus();
                    /*
                    if(test){
                        console.error('ma');
                    }
                    */
                }
            }



            _debug && console.log('selection : ' + (items? items[0].path  : "") +reason  +  _.pluck(items,'path').join('\n'),[items,options]);


            if(delay) {
                setTimeout(function () {
                    /*
                    if(options.focus===true){
                        self.focus(items[0],false);
                    }
                    */
                    $(self.domNode).find('.dgrid-focus').each(function(i,el){
                        $(el).removeClass('dgrid-focus');
                    });
                    items.length && self.focus(items[0],false);
                    self.__select(items,toRow,select,def);
                }, delay);
            }else{
                /*
                if(options.focus===true){
                    self.focus(items[0],false);
                }*/
                //items.length && self.focus(items[0]);
                self.__select(items,toRow,select,def);
            }

            return def;


        },
        isExpanded: function (item) {
            item  = this._normalize('root');
            return !!this._expanded[item.id];
        },
        _expandTo:function(item){

            if(!item){
                return;
            }
            var store = this.collection;

            if(_.isString(item)){
                item = store.getSync(item);
            }
            var parent = store.getSync(item[store.parentField]);
            if(parent){
                if(!this.isRendered(parent)) {
                    this._expandTo(parent);
                }else{
                    if(!this.isExpanded(parent)){
                        this.expand(parent, true, true);
                    }
                }
            }
        },
        isRendered:function(item){
            item = this._normalize(item);
            return item && item.element!=null;
        },
        startup: function () {

            this.inherited(arguments);


            var thiz = this;

            thiz.domNode.tabIndex = 2;


            if(this.hasFeature('KEYBOARD_SELECTION')) {

                this._listeners.push(on(thiz.domNode, 'keyup', function (event) {

                    // For now, don't squash browser-specific functionality by letting
                    // ALT and META function as they would natively
                    if (event.metaKey || event.altKey) {
                        return;
                    }
                    var handler = thiz['keyMap'][event.keyCode];
                    // Text boxes and other inputs that can use direction keys should be ignored
                    // and not affect cell/row navigation
                    if (handler && !handledEvent(event) && thiz.getSelection().length == 0) {
                        handler.call(thiz, event);
                    }
                }));
            }
        }

    };
    //package via declare
    var _class = declare('xgrid.Selection',Selection,Implementation);
    _class.Implementation = Implementation;

    return _class;
});