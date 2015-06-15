/** @module xgrid/data/Source **/
define([
    "xdojo/declare"
], function (declare) {


    /**
     * A grid feature
     * @class module:xgrid/data/Source
     */
    var Implementation={
        
        _references:[],
        addReference:function(item,settings,addSource){

            this._references.push({
                item:item,
                settings:settings
            });
            var thiz = this;
            if(settings && settings.onDelete){


                if(item._store) {
                    item._store.on('delete', function (evt) {
                        if (evt.target == item) {
                            console.log('on reference removed');
                            thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                        }
                    })
                }else{
                    console.warn('item has no store');
                }
            }

            if(addSource ) {
                if(item.addSource) {
                    item.addSource(this, settings);
                }else{
                    console.warn('item is not a reference!');
                }
            }

        },
        removeReference:function(Reference){},

        updateReference:function(References){},
        updateReferences:function(args){

            for (var i = 0; i < this._references.length; i++) {
                var link = this._references[i];
                var item = link.item;
                var settings = link.settings;

                if(args.property && settings.properties && settings.properties[args.property]){
                    console.log('source property updated!');
                    item._store._ignoreChangeEvents=true;
                    item.set(args.property,args.value);
                    item._store._ignoreChangeEvents=false;
                    item._store.emit('update', {target: item});
                }

            }
        },

        onReferenceUpdate:function(Reference){},

        onReferenceRemoved:function(Reference){},
        onReferenceDelete:function(Reference){},
        constructor:function(properties){

            this._references = [];
            for (var prop in properties) {
                this[prop] = properties[prop];
            }
        },
        /**
         *
         * @param args
         */
        onItemChanged:function(args){

            console.log('on source changed',args);

            this.updateReferences(args);
        }

    };

    //package via declare
    var _class = declare('xgrid.data.Source',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});