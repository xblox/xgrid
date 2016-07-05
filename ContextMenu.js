/** module:xgrid/ContextMenu **/
define([
    'dojo/_base/declare',
    'xide/utils',
    'xide/widgets/ContextMenu',
    'xide/widgets/_Widget'
],function (declare,utils,ContextMenu,_Widget){

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
                _ctorArgs = this.contextMenuArgs || {},
                mixin = {
                    owner:this,
                    delegate:this
                };

            utils.mixin(_ctorArgs,mixin);

            var node = this.contentNode;
            var contextMenu = new ContextMenu(_ctorArgs,node);
            contextMenu.openTarget = node;
            contextMenu.init({preventDoubleContext: false});
            contextMenu._registerActionEmitter(this);
            this.contextMenu = contextMenu;

            //track for destroy, otherwise a very bad leak
            //this.add(contextMenu,null,false);
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