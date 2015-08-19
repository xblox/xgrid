/** @module xgrid/Toolbar **/
define([
    "xdojo/declare",
    'xide/utils',
    'xide/widgets/ActionToolbar'
], function (declare,utils,ActionToolbar) {

    /**
     * A grid feature
     * @class module:xgrid/Toolbar
     * @extends xgrid/Layout
     */
    var Implementation = {
        _toolbar:null,
        getToolbar:function(){
            return this._toolbar;
        },
        showToolbar:function(show){

            if(show && !this._toolbar){

                this._toolbar = utils.addWidget(ActionToolbar,{
                    "class":"dijit dijitToolbar",
                    style:'min-height:30px;height:auto;width:100%',
                    subscribes:{
                        'onSetItemsActions':false
                    }
                },this,this.header,true);

            }
            if(!show && this._toolbar){
                utils.destroy(this._toolbar,true,this);
            }
        },
        buildRendering:function(){

            this.inherited(arguments);
            this.showToolbar(true);
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