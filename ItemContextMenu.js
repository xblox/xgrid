/** module:xgrid/ItemContextMenu **/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'xide/utils',
    'xide/types',
    'xide/widgets/ContextMenu'
],function (declare,lang,utils,types,ContextMenu){

    return declare("xgrid/ItemContextMenu",null,{

        contextMenuHandler:null,
        getContextMenu:function(){
            return this.contextMenuHandler;
        },
        destroy:function(){
            this.contextMenuHandler.destroy();
            this.inherited(arguments);
        },
        postCreate:function(){

            this.inherited(arguments);

            var thiz = this,
                _ctorArgs = {
                    _actions: [
                        {
                            label: "File"
                        },
                        {
                            label: "Edit"
                        },
                        {
                            label: "View"
                        }
                    ],
                    subscribes:{
                        'onSetItemsActions':false
                    }
                },
                mixin = {
                    owner:this,
                    delegate:this
                };


            utils.mixin(_ctorArgs,mixin);

            var contextMenuHandler = new ContextMenu(_ctorArgs);
            contextMenuHandler.startup();
            contextMenuHandler.initWithNode(thiz);
            thiz.contextMenuHandler = contextMenuHandler;
        },
        startup:function(){

            this.inherited(arguments);

            this._on('selectionChanged',function(evt){
                console.log('selection changed : ',evt);
            }.bind(this));

        }
    });
});