/** @module xgrid/data/Source **/
define([
    "xdojo/declare"
], function (declare) {


    /**
     * A grid feature
     * @class module:xgrid/data/Source
     */
    var Implementation={
        
        _references:null,
        getReferences:function(){


            var result = [];
            _.each(this._references,function(ref){
                result.push(ref.item);
            });

            return result;
        },
        addReference:function(item,settings,addSource){

            if(!this._references){
                this._references=[];
            }

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

            //console.log('add reference to ' + this.command + ' : ' + item.item.command + ' id='+item.id,this._references);

        },
        removeReference:function(Reference){

            _.each(this._references,function(ref){
                if(ref && ref.item==Reference){
                    //console.log('remove reference !',ref.item);
                    this._references.remove(ref);
                }else{
                    //console.error('error removing reference: ',Reference);
                }
            },this);
        },
        updateReference:function(References){},
        updateReferences:function(args){




            for (var i = 0; i < this._references.length; i++) {
                var link = this._references[i],
                    item = link.item,
                    settings = link.settings;

                if(this._originReference == item){
                    continue;
                }


                console.log('updateReference!',item);


                if(args.property && settings.properties && settings.properties[args.property]){

                    //console.log('source property updated!');

                    if(item._store) {
                        item._store._ignoreChangeEvents = true;
                    }else{
                        console.error('reference has no store');
                    }

                    try {
                        if (item.propertyToMap && item.propertyToMap[args.property]) {

                            var mapping = item.propertyToMap[args.property];

                            if (_.isString(mapping)) {
                                item.set(mapping, args.value);
                            } else {
                                console.log('set reference ' + mapping.name + ' :: ' + mapping.value);
                                item.set(mapping.name, mapping.value);
                            }

                        } else {
                            item.set(args.property, args.value);
                        }
                    }catch(e){
                        console.error('error updating reference! '+e,e);
                    }

                    if(item._store) {
                        item._store._ignoreChangeEvents = false;
                        item._store.emit('update', {target: item});
                    }else{
                        console.error('reference has no store');
                    }

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

            //console.log('on source changed',args);
            try {
                this.updateReferences(args);
            }catch(e){
                console.error('eerror',e);
            }
        }

    };

    //package via declare
    var _class = declare('xgrid.data.Source',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});