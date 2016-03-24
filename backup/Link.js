define([
    "xdojo/declare"
], function (declare) {
    var Implementation={
        _links:[],
        addLink:function(item,settings,addSource){

            this._links.push({
                item:item,
                settings:settings
            });
            var thiz = this;
            if(settings && settings.onDelete){
                item._store.on('delete',function(evt){
                    if(evt.target==item){
                        thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                    }
                })
            }
            if(addSource===true) {
                item.addLink(this,settings);
            }
        },
        removeReference:function(Reference){},
        updateReference:function(References){},
        updateLinks:function(args){
            for (var i = 0; i < this._links.length; i++) {
                var link = this._links[i];
                var item = link.item;
                var settings = link.settings;

                if(args.property &&
                    settings.properties &&
                    settings.properties[args.property])
                {
                    console.log('property updated!');
                    item._store._ignoreChangeEvents=true;
                    this._store._ignoreChangeEvents=true;
                    item.set(args.property,args.value);
                    item._store.emit('update', {target: item});
                    item._store._ignoreChangeEvents=false;
                    this._store._ignoreChangeEvents=false;
                }

            }
        },

        onReferenceUpdate:function(Reference){},
        onReferenceRemoved:function(Reference){},
        onReferenceDelete:function(Reference){},
        constructor:function(properties){
            this._links = [];
            for (var prop in properties) {
                this[prop] = properties[prop];
            }
        },
        /**
         *
         * @param args
         */
        onItemChanged:function(args){
            this.updateLinks(args);
        }

    };

    //package via declare
    var _class = declare('xgrid.data.Link',null,Implementation);
    _class.Implementation = Implementation;
    return _class;
});