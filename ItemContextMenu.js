/** module:xgrid/ItemContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu',
    './_Actions'
],function (declare,utils,ContextMenu,_Actions){

    return declare("xgrid/ItemContextMenu",[_Actions],{

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
        onContainerClick:function(){
            this.updateActions(this.getGridActionProvider ? this.getGridActionProvider() : null,this.getContextMenu());
            this.inherited(arguments);
        },
        onItemClick:function(){
            this.updateActions(this.getItemActionProvider ? this.getItemActionProvider() : null,this.getContextMenu());
            this.inherited(arguments);
        },
        startup:function(){
            if(this._started){
                return;
            }
            this.inherited(arguments);
        }
    });
});