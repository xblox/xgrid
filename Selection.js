/** @module xgrid/Selection **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dgrid/Selection',
    'dojo/dom-class',
    'dojo/on'
], function (declare,types,utils,Selection,domClass,on) {
    /**
     *
     *
     *
     * @class module xgrid/Selection
     *
     */
    var Implementation = {
        _lastSelection:null,
        /**
         * Mute any selection events.
         */
        _muteSelectionEvents:true,
        /**
         * Normalize an item
         * @param what
         * @returns {*}
         * @private
         */
        _normalize:function(what){
            if(!what.element)
            {
                what = this.cell(what);
            }
            if(what && what.row){
                what=what.row;
            }
            return what;
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
         * @returns {*}
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
                        this.clearSelection();
                        this.getRows(true).forEach(function (row) {
                            domClass.remove(row, 'dgrid-focus');
                        });

                    }
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
                thiz._lastSelection=data;
                //console.profile('s');
                thiz._emit('selectionChanged',{
                    selection:this.getSelection(),
                    why:"select"
                });
                console.profileEnd('s');
            }.bind(this));




            this.on("dgrid-deselect", function (data) {
                thiz._lastSelection=null;
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


            console.log('select',arguments);

            options = options || {};


            //silence selection change (batch or state restoring job)
            if(options.silent===true){
                this._muteSelectionEvents=true;
            }

            //clear previous selection
            if(options.append===false){
                this.clearSelection();
            }

            //normalize to array
            var items = utils.isArray(mixed) ? mixed : [mixed];

            if(options.focus===true){
                this.focus(items[0]);
            }

            _.each(items,function(item){
                this._select(this.row(item),toRow,select);
            },this);

            this._muteSelectionEvents=false;
            this._fireSelectionEvents();
        },
        startup: function () {

            this.inherited(arguments);


            var thiz = this;

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