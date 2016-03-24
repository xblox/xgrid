/** @module xide/data/Reference **/
define([
    "xdojo/declare"
], function (declare) {

    /**
     * A grid item feature
     * @class module:xide/data/Reference
     */
    var Implementation = {

        _sources:[],
        destroy:function(){

            if(!this.item.removeReference){
                console.error('item has no removeReference');
            }else {
                this.item.removeReference(this);
            }
            this.inherited(arguments);
        },
        addSource:function(item,settings){

            this._sources.push({
                item:item,
                settings:settings
            });
            var thiz = this;

            if(settings && settings.onDelete){
                item._store.on('delete',function(evt){
                    if(evt.target==item){
                        //console.log('source removed');
                        thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                    }
                })
            }

        },
        removeSource:function(source){},

        updateSource:function(sources){},
        updateSources:function(args){

            for (var i = 0; i < this._sources.length; i++) {
                var link = this._sources[i];
                var item = link.item;
                var settings = link.settings;
                if(args.property && settings.properties &&
                    settings.properties[args.property]){
                    item._store._ignoreChangeEvents=true;
                    //console.log('ref property updated!');
                    item.set(args.property,args.value);
                    item._store._ignoreChangeEvents=false;
                    item._store.emit('update', {target: item});
                }


            }
        },

        onSourceUpdate:function(source){},

        onSourceRemoved:function(source){},
        onSourceDelete:function(source){},

        constructor:function(properties){
            this._sources = [];
            for (var prop in properties) {
                this[prop] = properties[prop];
            }
        },
        onItemChanged:function(args){

            //console.log('on reference changed',args);
            //this.updateSources(args);
        }


    };

    //package via declare
    var _class = declare('xgrid.data.Reference',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});