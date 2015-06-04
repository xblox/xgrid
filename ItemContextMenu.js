/** module:xgrid/ItemContextMenu **/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'xide/utils',
    'xide/types',
    'xide/widgets/ContextMenu',
    'dojo/dom-class'
],function (declare,lang,utils,types,ContextMenu,domClass){

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
            if(this._started){
                return;
            }

            this.inherited(arguments);

            var clickHandler = function(evt) {

                if (evt && evt.target && domClass.contains(evt.target, 'dgrid-content')) {
                    //container click:
                    console.log('container click');
                    var gridActionProvider = this.getGridActionProvider ? this.getGridActionProvider() : null;
                    if(gridActionProvider){
                        var actions = gridActionProvider.getItemActions();
                        this.getContextMenu().setItemActions({},actions);
                    }

                }else{
                    //item click
                    var gridActionProvider = this.getItemActionProvider ? this.getItemActionProvider() : null;
                    if(gridActionProvider){
                        var actions = gridActionProvider.getItemActions();
                        this.getContextMenu().setItemActions({},actions);
                    }
                }



            }.bind(this);

            this.on("click", function (evt) {
                clickHandler(evt);
            }.bind(this));

            this.on("contextmenu", function (evt) {
                clickHandler(evt);
            }.bind(this));


            this._on('selectionChanged',function(evt){
                console.log('selection changed : ',evt);
            }.bind(this));


        }
    });
});