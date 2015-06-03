/** @module xgrid/Selection **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dgrid/Selection',
    'dojo/dom-class'
], function (declare,types,utils,Selection,domClass) {
    /**
     *
     */
    var Implementation = {
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
         * Override std::postCreate
         * @returns {*}
         */
        postCreate:function(){

            var thiz = this;
            if(this.options[types.GRID_OPTION.CLEAR_SELECTION_ON_CLICK]===true){

                var clickHandler = function(evt) {

                    if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                        this.clearSelection();
                        this.getRows().forEach(function (row) {
                            domClass.remove(row.element, 'dgrid-focus');
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

            this.on("dgrid-select", function (data) {

                thiz._emit('selectionChanged',{
                    selection:this.getSelection(),
                    why:"dgrid-select"
                });
            }.bind(this));



            /*
            this.on("dgrid-deselect", function (data) {
                thiz._emit('selectionChanged', {
                    selection: this.getSelection(),
                    why: "dgrid-deselect"
                });
            }.bind(this));
            */


            return this.inherited(arguments);
        },
        /**
         * Override digrd/Selection::_fireSelectionEvents
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
        }

    };
    //package via declare
    var _class = declare('xgrid.Selection',[Selection],Implementation);
    _class.Implementation = Implementation;

    return _class;
});