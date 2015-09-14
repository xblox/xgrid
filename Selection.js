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
    /**
     *
     *
     *
     * @class module xgrid/Selection
     *
     */
    var Implementation = {

        _lastSelection:null,
        _lastFocused:null,
        _refreshInProgress:false,
        refresh:function(){

            if(this._refreshInProgress){
                return;
            }

            this._refreshInProgress = this;

            var _restore = this._preserveSelection(),
                thiz = this,
                active = this.isActive(),
                res = this.inherited(arguments);

            res.then(function(){

                thiz._refreshInProgress = false;
                thiz._restoreSelection(_restore);
                if(_restore.focused && active) {
                    thiz.focus(thiz.row(_restore.focused));
                }
            });

            return res;
        },
        /**
         * Mute any selection events.
         */
        _muteSelectionEvents:true,
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
            }

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
         * @returns selection {Object[]}
         */
        getSelection:function(filterFunction){

            var result = [];
            for (var id in this.selection) {
                result.push(this.collection.getSync(id));
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

                    //console.log('new selection',data);
                    thiz._lastSelection=data;
                    //console.profile('s');
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
        /**
         *
         * @param mixed
         * @param toRow {object} preserve super
         * @param select {boolean} preserve super
         * @param options {object}
         * @param options.focus {boolean}
         * @param options.silent {boolean}
         * @param options.append {boolean}
         */
        select:function(mixed,toRow,select,options){



            //console.log('select! ' , arguments);
            var def  = new Deferred();

            options = options || {};


            //silence selection change (batch or state restoring job)
            if(options.silent===true){
                this._muteSelectionEvents=true;
            }

            //clear previous selection
            if(options.append===false){
                this.clearSelection();
                $(this.domNode).find('.dgrid-focus').each(function(i,el){
                    $(el).removeClass('dgrid-focus');
                });
            }

            //normalize to array
            var items = utils.isArray(mixed) ? mixed : [mixed];
            if(_.isEmpty(items)){
                return;
            }

            if(_.isNumber(items[0])){

                var _newItems = [];
                var rows = this.getRows();
                _.each(items,function(item){
                    _newItems.push(rows[item]);
                });
                items = _newItems;
            }


            if(options.focus===true){

                if(options.expand==null){
                    options.expand=true;
                }

                if(options.expand){

                    if(!this.isRendered(items[0])||items[0].__dirty){
                        this._expandTo(items[0]);
                    }
                }
                this.focus(items[0]);
            }

            var delay = options.delay || 1,
                thiz = this;




            setTimeout(function(){

                _.each(items,function(item){
                    if(item) {
                        var _row = thiz.row(item);
                        if(_row) {
                            thiz._select(_row, toRow, select);
                        }
                    }
                });

                thiz._muteSelectionEvents=false;
                thiz._fireSelectionEvents();

                def.resolve();

            },delay);


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

                function handledEvent(event) {
                    // Text boxes and other inputs that can use direction keys should be ignored
                    // and not affect cell/row navigation
                    var target = event.target;
                    return target.type && (event.keyCode === 32);
                }

                this._listeners.push(on(thiz.domNode, 'keyup', function (event) {

                    // For now, don't squash browser-specific functionalities by letting
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
    var _class = declare('xgrid.Selection',[Selection],Implementation);
    _class.Implementation = Implementation;

    return _class;
});