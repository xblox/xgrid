/** module:xgrid/ItemContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu'
],function (declare,utils,ContextMenu){

    return declare("xgrid.ItemContextMenu",null,{
        contextMenu:null,
        getContextMenu:function(){
            return this.contextMenu;
        },
        destroy:function(){
            if(this.contextMenu) {
                this.contextMenu.destroy();
            }
            this.inherited(arguments);
        },
        /**
         * callback when user clicks on the grid view (not an item), triggered ./Actions
         */
        onContainerClick:function(){

            this.getContextMenu().setItemActions(this.getSelection()[0],this._getActionsFiltered('view'));
            this.inherited(arguments);
        },
        /**
         * callback when user clicks on an item, triggered in ./Actions
         */
        onItemClick:function(){

            var itemActions = this._getActionsFiltered('item');
            this.getContextMenu().setItemActions(this.getSelection()[0],itemActions);
            this.inherited(arguments);
        },
        startup:function(){

            if(this._started){
                return;
            }
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
                        },
                        {
                            label: "Block"
                        },
                        {
                            label: "Organize"
                        },
                        {
                            label: "Select"
                        },
                        {
                            label: "Clipboard"
                        },
                        {
                            label: "Step"
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

            var contextMenu = new ContextMenu(_ctorArgs);
            contextMenu.startup();
            contextMenu.initWithNode(thiz);
            thiz.contextMenu = contextMenu;
        }
    });
});