/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/types',
    'xide/widgets/ActionToolbar'
], function (declare,utils,types,ActionToolbar) {

    /**
     * A grid feature
     * @class module:xgrid/Toolbar
     */
    var Implementation = {
        _toolbar:null,
        toolbarInitiallyHidden:false,
        runAction:function(action){

            if(action.command==types.ACTION.TOOLBAR){
                this.showToolbar(this._toolbar==null);
            }
            return this.inherited(arguments);
        },
        getToolbar:function(){
            return this._toolbar;
        },
        showToolbar:function(show){

            if(show==null){
                show = this._toolbar==null;
            }


            if(show && !this._toolbar){
                this._toolbar = utils.addWidget(ActionToolbar,{
                    "class":"dijit dijitToolbar",
                    style:'min-height:30px;height:auto;width:100%',
                    subscribes:{
                        'onSetItemsActions':false
                    }
                },this,this.header,true);
                this.onContainerClick();

            }
            if(!show && this._toolbar){
                utils.destroy(this._toolbar,true,this);
            }
        },
        buildRendering:function(){

            this.inherited(arguments);
            if(this.toolbarInitiallyHidden===true) {

            }else{
                this.showToolbar(true);
            }

            var grid = this,
                node = grid.domNode.parentNode;

            try {
                this._on('onAddActions', function (evt) {

                    var actions = evt.actions,
                        permissions = evt.permissions;

                    var _action = grid.createAction('Toolbar', types.ACTION.TOOLBAR, types.ACTION_ICON.TOOLBAR, ['ctrl b'], 'View', 'Show', 'item|view', null, null, null, null, null, permissions, node, grid);
                    if (!_action) {
                        return;
                    }
                    actions.push(_action);
                });
            }catch(e){
                debugger;
            }
        },
        /**
         * callback when user clicks on the grid view (not an item), triggered ./Actions
         */
        onContainerClick:function(){
            var toolbar = this.getToolbar();
            if(toolbar) {
                toolbar.setItemActions(this.getSelection()[0], this._getActionsFiltered('view'));
            }
            this.inherited(arguments);
        },
        /**
         * callback when user clicks on an item, triggered in ./Actions
         */
        onItemClick:function(){
            var itemActions = this._getActionsFiltered('item');
            var toolbar = this.getToolbar();
            if(toolbar) {
                toolbar.setItemActions(this.getSelection()[0], itemActions);
            }
            this.inherited(arguments);
        }
    };

    //package via declare
    var _class = declare('xgrid.Toolbar',null,Implementation);
    _class.Implementation = Implementation;

    return _class;
});