/** module:xgrid/ContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu'
],function (declare,utils,ContextMenu){

    return declare("xgrid.ContextMenu",null,{
        contextMenu:null,
        getContextMenu:function(){
            return this.contextMenu;
        },
        destroy:function() {
            if (this.contextMenu) {
                this.contextMenu.destroy();
            }
            this.inherited(arguments);
        },
        _createContextMenu:function(){
            var thiz = this,
                _ctorArgs = {},
                mixin = {
                    owner:this,
                    delegate:this
                };

            utils.mixin(_ctorArgs,mixin);

            var node = this.domNode;
            var contextMenu = new ContextMenu(_ctorArgs,node);
            contextMenu.openTarget = node;
            contextMenu.init({preventDoubleContext: false});
            contextMenu._registerActionEmitter(this);
            this.contextMenu = contextMenu;
        },
        startup:function(){
            if(this._started){
                return;
            }
            this.inherited(arguments);
            this._createContextMenu();
        }
    });
});