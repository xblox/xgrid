/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    "xide/mixins/EventedMixin"
], function (declare,EventedMixin) {

    var _debug = false;
    var _debugChange = true;
    /**
     * A grid feature
     * @class module:xgrid/data/ObservableStore
     */
    return declare('xgrid/data/Observable',EventedMixin,{

        _ignoreChangeEvents:true,
        observedProperties:[],
        /**
         * @param item
         */
        putSync:function(item){
            this._all = null;
            this._ignoreChangeEvents=true;
            var res = this.inherited(arguments);
            this._ignoreChangeEvents=false;
            this.emit('added',res);
            return res;
        },
        /**
         * @param item
         */
        removeSync:function(id){

            this._all = null;
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

            _debug && console.log('item changed',arguments);

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

            var props = thiz.observedProperties;

            if(item && item.observed){
                props = props.concat(item.observed);
            }


            props.forEach(function (property) {

                _debug && console.log('observe item : ' +item.command + ' for '+property);
                item.property(property).observe(function (value) {
                    if (!thiz._ignoreChangeEvents){
                        _debugChange && console.log('property changed: ' +property);
                        thiz._onItemChanged(item, property, value, thiz);
                    }
                });
            });

        },
        /**
         * Override setting initial data
         * @param data
         */
        setData:function(data){
            this.inherited(arguments);
            this._ignoreChangeEvents=true;
            if(data && data.forEach) {
                data.forEach(this._observe, this);
            }else{
                debugger;
            }
            this._ignoreChangeEvents=false;
        }
    });
});