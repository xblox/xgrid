/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/types',
    'xide/utils',
    'dstore/Trackable'
], function (declare,types,utils,Trackable) {
    /**
     * A grid feature
     * @class module:xgrid/data/ObservableStore
     */
    return declare('xgrid/data/Observable',null,{
        _ignoreChangeEvents:true,
        putSync:function(item){
            this._ignoreChangeEvents=true;
            this.inherited(arguments);
            this._ignoreChangeEvents=false;
        },
        constructor:function(){
            var thiz = this;
            if(!this.on){
                return;
            }
            this.on('add',function(evt){
                thiz._observe(evt.target);
            });
        },
        _onItemChanged:function(item,property,value){

            if(this._ignoreChangeEvents){
                return;
            }

            this.emit('update',{
                target: item,
                property:property,
                value:value
            });


        },
        /**
         *
         * @param item
         * @private
         */
        _observe:function(item){
            var thiz = this;
            thiz.observedProperties.forEach(function(property){
                item.property(property).observe(function (value) {
                    thiz._onItemChanged(item,property,value);
                });
            });
        },
        /**
         * Override setting initial data
         * @param data
         */
        setData:function(data){
            this.inherited(arguments);
            data.forEach(this._observe,this);
            this._ignoreChangeEvents=false;
        }
    });

});