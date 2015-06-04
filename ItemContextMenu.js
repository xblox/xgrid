/** module:xgrid/ItemContextMenu **/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'xide/utils',
    'xide/types',
    'xide/widgets/ContextMenu',
    'dojo/dom-class',
    './_Actions'
],function (declare,lang,utils,types,ContextMenu,domClass,_Actions){

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