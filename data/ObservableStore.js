/** @module xgrid/Toolbar **/
define([
    "xdojo/declare"
], function (declare) {
    /**
     * A grid feature
     * @class module:xgrid/data/ObservableStore
     */
    return declare('xgrid/data/Observable',null,{

        _ignoreChangeEvents:true,
        observedProperties:[],
        /**
         * @param item
         */
        putSync:function(item){
            this._ignoreChangeEvents=true;
            var res = this.inherited(arguments);
            this._ignoreChangeEvents=false;
            return res;
        },
        /**
         * @param item
         */
        removeSync:function(id){

            var _item = this.getSync(id);
            if(_item && _item.onRemove){
                _item.onRemove();
            }

            var res = this.inherited(arguments);

            return res;
        },
        /**
         *
         */
        postscript:function(){

            var thiz = this;
            thiz.inherited(arguments);
            if(!thiz.on){
                return;
            }
            thiz.on('add',function(evt){
                var _item = evt.target;
                thiz._observe(_item);
                if(!_item._store){
                    _item._store = thiz;
                }

                //ActionModel::_onCreated will add a reference
                _item._onCreated();

                if(_item.onAdd){
                    _item.onAdd(_item);
                }

            });
        },
        /**
         *
         * @param item
         * @param property
         * @param value
         * @param source
         * @private
         */
        _onItemChanged:function(item,property,value,source){

            if(this._ignoreChangeEvents){
                //console.log('item changed, ignore !!',arguments);
                return;
            }

            console.log('item changed',arguments);

            var args = {
                target: item,
                property:property,
                value:value,
                source:source
            };

            this.emit('update',args);

            if(item.onItemChanged){
                item.onItemChanged(args);
            }


        },
        /**
         *
         * @param item
         * @private
         */
        _observe:function(item){

            var thiz = this;
                thiz.observedProperties.forEach(function (property) {

                    //console.log('observe item : ' +item.cmmand + ' for '+property);

                    item.property(property).observe(function (value) {
                        //console.log('property changed' +property + ' for '+value);
                        thiz._onItemChanged(item, property, value,thiz);
                    });
                });

        },
        /**
         * Override setting initial data
         * @param data
         */
        setData:function(data){
            this.inherited(arguments);
            if(data && data.forEach) {
                data.forEach(this._observe, this);
            }else{
                debugger;
            }
            this._ignoreChangeEvents=false;
        }
    });
});