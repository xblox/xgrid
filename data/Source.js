/** @module xgrid/data/Source **/
define([
    'dcl/dcl',
    "xdojo/declare",
    'xide/utils'
], function (dcl,declare,utils) {

    var _debug = false;

    /**
     * A grid feature
     * @class module:xgrid/data/Source
     */
    var Implementation={
        _references:null,
        getReferences:function(){
            return this._references ? utils.pluck(this._references,'item') : [];
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
                            //console.log('on reference removed');
                            thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                        }
                    })
                }
            }

            if(addSource ) {
                if(item.addSource) {
                    item.addSource(this, settings);
                }else{
                    _debug && console.log('empty: ',item.command);
                }
            }

            //console.log('add reference to ' + this.command + ' : ' + item.item.command + ' id='+item.id,this._references);

        },
        removeReference:function(Reference){
            _debug && console.log('remove reference ' + Reference.label,Reference);

            this._references && _.each(this._references,function(ref){

                if(ref && ref.item==Reference){
                    this._references && this._references.remove(ref);
                }
            },this);
        },
        updateReferences:function(args){


            var property = args.property,
                value = args.value;

            if(!this._references){
                this._references = [];
            }

            for (var i = 0; i < this._references.length; i++) {

                var link = this._references[i],
                    item = link.item,
                    settings = link.settings,
                    store = item._store;

                if(this._originReference == item){
                    continue;
                }

                if(args.property && settings.properties && settings.properties[args.property]){

                    if(store) {
                        store._ignoreChangeEvents = true;
                    }else{
                        //console.error('reference has no store');
                    }

                    try {
                        if(item.onSourceChanged){
                            item.onSourceChanged(property,value);
                        }else{
                            item.set(property, value);
                        }

                    }catch(e){
                        console.error('error updating reference! '+e,e);
                    }
                    if(store) {

                        store._ignoreChangeEvents = false;
                        store.emit('update', {target: item});
                    }
                }
            }
        },
        onReferenceUpdate:function(){},
        onReferenceRemoved:function(){},
        onReferenceDelete:function(){},
        updateReference:function(){},
        constructor:function(properties){
            this._references = [];
            utils.mixin(this,properties);
        },
        onItemChanged:function(args){
            this.updateReferences(args);
        }
    };

    //package via declare
    var _class = declare('xgrid.data.Source',null,Implementation);
    _class.dcl = dcl(null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});
