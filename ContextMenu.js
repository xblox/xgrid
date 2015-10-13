/** module:xgrid/ItemContextMenu **/
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
                _ctorArgs = {

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

            contextMenu.addActionEmitter(this);
            contextMenu.setActionEmitter(this);
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