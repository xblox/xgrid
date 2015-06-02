define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dgrid/Selection',
    'dojo/dom-class'
], function (declare,types,utils,Selection,domClass) {

    var Implementation = {

        _muteSelectionEvents:true,
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
        getPrevious:function(from,domNode,skipSelected){

            from = from || this.getFocused(domNode);
            from = this._normalize(from);

            var nextNode = this.cell(this._move(from, -1, "dgrid-row"));
            if(nextNode && nextNode.row){
                nextNode = nextNode.row[domNode? 'element' : 'data' ];
                if(skipSelected===true) {
                    //console.warn('is selected: ' + );
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
        postCreate:function(){

            if(this.options[types.GRID_OPTION.CLEAR_SELECTION_ON_CLICK]===true){

                this.on("click", function (evt) {
                    if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                        this.clearSelection();
                        this.getRows().forEach(function (row) {

                            console.log('remove focus');

                            domClass.remove(row.element, 'dgrid-focus');
                        });

                    }
                }.bind(this));
            }
            return this.inherited(arguments);
        },
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

            if(options.silent===true){
                this._muteSelectionEvents=true;
            }


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
        getSelection:function(filterFunction){
            var result = [];
            for (var id in this.selection) {
                result.push(this.collection.getSync(id));
            }
            if(filterFunction){
                return result.filter(filterFunction);
            }
            return result;
        }
    };

    //package via declare
    var _class = declare('xgrid.Selection',[Selection],Implementation);
    _class.Implementation = Implementation;

    return _class;
});