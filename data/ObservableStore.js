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
         *
         */
        postscript:function(){

            this.inherited(arguments);

            var thiz = this;
            if(!this.on){
                return;
            }
            this.on('add',function(evt){
                thiz._observe(evt.target);
            });
        },
        /**
         *
         * @param item
         * @param property
         * @param value
         * @private
         */
        _onItemChanged:function(item,property,value,source){
            if(this._ignoreChangeEvents){
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
                    item.property(property).observe(function (value) {
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